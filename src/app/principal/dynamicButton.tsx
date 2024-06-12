'use client'
import React, { useState, useEffect, useRef, use } from 'react';
import MenuDesplegable from './menuDesplegable';
import MenuAsignar from './menuAsignar';
import Mensajeria from './menuChats';
import { GuardarEdificio, getBuildingsByUserId, builtEdificio, getUEbyUserId, getUEById } from '../../services/userEdificios';
import { getUserByCooki, getUser, getUserByHash, getUserById, updateUserRecursos} from '@/services/users';
import {recolectarRecursos } from '@/services/recursos';
import { getChats, getUsernameOther, getChatName } from '@/services/chats';
import { getMensajes } from '@/services/mensajes';
import { updateUserBuildings, getBuildingCount} from '@/services/users';
import { getEdificioById } from '@/services/edificios';

import { Await } from 'react-router-dom';

type Building = {
  x: number;
  y: number;
  type: string;
  ancho: number;
  largo: number;
  id: string;
  nivel: number;
  costo: number;
  cantidad: number;
};
type datos = {
  edifId: string,
  userId: string
}

const DynamicBuildings: React.FC = () => {

  const [buildings, setBuildings] = useState<Building[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [draggedBuildingIndex, setDraggedBuildingIndex] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [madera, setMadera] = useState(0);
  const [piedra, setPiedra] = useState(0);
  const [pan, setPan] = useState(0);
  const[unidadesDisponibles, setUnidadesDisp] = useState(0)
  const [usuario, setUser] = useState('');
  const [userId, setUserId] = useState('')
  //cuando se cliclea un botón se habilita 
  const[menuButton, setMenBut] = useState(false);
  const[menuButton2, setMenBut2] = useState("");
  // para la mensajeria
  const [userLoaded, setUserLoaded] = useState(false);
  const [mostrarMensajeria, setMostrarMensajeria] = useState(false);
  const [chats, setChats] = useState<any[]>([]);
  const [chatnames, setChatNames] = useState<string[]>([]);

  const [canon, setCanon] = useState(0);
  const [maderera, setMaderera] = useState(0);
  const [cantera, setCantera] = useState(0);
  const [panaderia, setPanaderia] = useState(0);
  const [bosque, setBosque] = useState(0);
  const [muros, setMuros] = useState(0);
  const [ayuntamiento, setAyuntamiento] = useState(0);
  const [herreria, setHerreria] = useState(0);

  
  //este método obtiene el dato recibido del hijo menuAsignar, el cual será usado para setear cerrar el botón
  const recibirDatosDelHijo = (datos: any) => {
    console.log("datos222", datos)
     setMenBut(!menuButton);
  };

// agrege  mensaje error y modifique  el handleBuildClick, modifique todo menudesplegable y updateBuildingCount
const [message, setMessage] = useState('');

useEffect(() => {
  if (message) {
    const timer = setTimeout(() => setMessage(''), 10000);
    return () => clearTimeout(timer);
  }
}, [message]);

const messageDivStyle = {
  display: message ? 'block' : 'none', // Mostrar el mensaje solo cuando hay un mensaje para mostrar
};
  const mouseMoveRef = useRef<(e: MouseEvent) => void>(() => {});
  const mouseUpRef = useRef<() => void>(() => {});
  
  //#region USEEFFECTS USUARIO
  //useffect para obetener el id de user 
  useEffect(() => {
    async function fetchData() {
      try {
        let resultado = await getUserByCooki();
        let usuarioId = resultado?.id;
        if (!usuarioId) {
          console.error('No user ID found');
          return;
        }
        console.log(usuarioId);
        setUserId(String(usuarioId));
        setUserLoaded(true);
        cargarUser();
        const [fetchedBuildings, chats] = await Promise.all([
          getBuildingsByUserId(usuarioId),
          getChats(usuarioId),
        ]);
        setBuildings(fetchedBuildings);
        console.log("fetchedBuildings", fetchedBuildings);
        setChats(chats);
        console.log('Chats:', chats);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [userId]);

//conseguir todos los nombres de los chats
useEffect(() => {
  if (chats.length > 0 && userId) {
    console.log('Fetching chat names...')
    Promise.all(chats.map(chat => getChatName(chat, userId)))
      .then(chatnames => {
        setChatNames(chatnames);
        console.log('Chat names:', chatnames);
      })
      .catch(error => console.error('Error fetching chat names:', error));
  }
}, [chats, userId]);
  
const handleBuildClick = async (id_edi: string, x: number, y: number, buildingType: string, ancho: number, largo: number, costos: number, cantidad:number) => {
  const existingBuilding = false //buildings.find(building => building.x === x && building.y === y && building.id === id);
    
   if (!existingBuilding) {
     

     // Actualizar el estado del usuario
     const construir = await updateBuildingCount(cantidad, costos, id_edi); // devuelve 1 si se puede construir, 0 si no
       //window.location.reload();
     // Llamar a la función para guardar el edificio en la base de datos
    
     if (construir === 1) {
       buildings.find(building => building.x === x && building.y === y && building.id === id_edi);
       
       const newBuilding = { id_edi, x, y, type: buildingType, ancho, largo, cantidad: 1 };
       //setBuildings([...buildings, newBuilding]);
        window.location.reload();
       try {
         // Evita recargar la página, en su lugar actualiza el estado
         await builtEdificio(userId, id_edi, x, y, 1);
         console.log('Edificio guardado exitosamente en la base de datos.');
        
       } catch (error) {
         console.error('Error al guardar el edificio en la base de datos:', error);
       }
     }
   } else {
     console.log('Ya hay un edificio del mismo tipo en estas coordenadas');
   }
 }; 
 

  const handleMenuClick = () => {
    setMenuOpen(!menuOpen);
  };
  

  const handleMouseDown = (index: number, event: React.MouseEvent<HTMLDivElement>) => {
    setDraggedBuildingIndex(index);
    const startX = event.clientX;
    const startY = event.clientY;
    setDragOffset({ x: startX - buildings[index].x, y: startY - buildings[index].y });

    mouseMoveRef.current = (e: MouseEvent) => {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      handleBuildingMove(index, newX, newY);
    };

    mouseUpRef.current = () => {
      setDraggedBuildingIndex(null);
      window.removeEventListener('mousemove', mouseMoveRef.current);
      window.removeEventListener('mouseup', mouseUpRef.current);
    };

    window.addEventListener('mousemove', mouseMoveRef.current);
    window.addEventListener('mouseup', mouseUpRef.current);

  };

  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  
  const handleBuildingMove = (index: number, newX: number, newY: number) => {
    setBuildings(prevBuildings => {
      // Copia profunda de los edificios previos
      const updatedBuildings = [...prevBuildings];
  
      // Dimensiones del contenedor
      const maxWidth = 1170;
      const maxHeight = 700;
  
      // Dimensiones del edificio actual
      const building = updatedBuildings[index];
      const { ancho: buildingWidth, largo: buildingHeight, id, nivel } = building;
  
      // Calcular nuevas coordenadas con restricciones
      const clampedX = Math.min(Math.max(newX, 0)+26, maxWidth - buildingWidth);
      const clampedY = Math.min(Math.max(newY, 0), maxHeight - buildingHeight);
  
      // Verificar si hay colisión con otros edificios
      const collidedBuildingIndex = getCollidedBuildingIndex(index, clampedX, clampedY, buildingWidth, buildingHeight);
  
      if (collidedBuildingIndex !== -1) {
        // Lógica de manejo de colisiones (asumiendo una función handleCollision)
        handleCollision(index, collidedBuildingIndex);
      } else {
        // Actualizar las coordenadas del edificio si no hay colisión
        building.x = clampedX;
        building.y = clampedY;
  
        // Manejar el timeout para evitar múltiples llamadas a la base de datos
        if (timeoutId !== null) {
          clearTimeout(timeoutId);
        }
  
        // Establecer un timeout para guardar el edificio en la base de datos
        timeoutId = setTimeout(() => {
          guardarEdificioEnBD(id, clampedX, clampedY, nivel);
          timeoutId = null;
        }, 500);
      }
  
      // Devolver la lista de edificios actualizada
      return updatedBuildings;
    });
  };
  
  // Función ficticia para manejar colisiones, a ser implementada según necesidades
  const handleCollision = (index: any, collidedBuildingIndex: any) => {
    console.log(`Colisión detectada entre el edificio ${index} y el edificio ${collidedBuildingIndex}`);
    // Lógica adicional para manejar la colisión...
  }
  
  const getCollidedBuildingIndex = (index: number, x: number, y: number, width: number, height: number) => {
    const buildingCenterX = x + width/2+10;
    const buildingCenterY = y + height/4-30 ;

    return buildings.findIndex((building, i) => {
        if (i !== index) {
            const otherCenterX = building.x + building.ancho ;
            const otherCenterY = building.y + building.largo ;

            const dx = buildingCenterX - otherCenterX;
            const dy = buildingCenterY - otherCenterY;

            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDistance = Math.sqrt((width / 2 + building.ancho / 2) ** 2 + (height / 2 + building.largo / 2) ** 2);

            return distance < minDistance;
        }
        return false;
    });
};


  const guardarEdificioEnBD = (id: string, posX: number, posY: number, nivel : number) => {
    GuardarEdificio(userId,id, posX, posY, nivel);
  };

  
  const recolectarRecursosUser = async () => {
/*     "use server" */
    const user = await getUserByCooki()
    if(user != null){
      await recolectarRecursos(user.id);
      setMadera(user.madera);
      setPiedra(user.piedra);
      setPan(user.pan);
    }
  }
  const cargarUser = async () => {
    const user = await getUserByCooki()
/* const user = await getUser(usoCooki().then(x =>x?.id)) */
    if(user != null){
      setMadera(user.madera);
      setPiedra(user.piedra);
      setPan(user.pan);
      setUser(String (user.username));
      setUnidadesDisp(user.unidadesDeTrabajo)
    //--------------------------------------------------
    //----------------------------------------------

      setMaderera(user.maderera);
      setCantera(user.cantera);
      setPanaderia(user.panaderia);
      setBosque(user.bosque);
      setMuros(user.muros);
      setAyuntamiento(user.ayuntamiento);
      setHerreria(user.herreria);
    }
  }
   // React.MouseEvent<HTMLButtonElement>
   function handleClick(event: any) {  

    const elementoClicado = event.target as HTMLElement;
    const idUE = elementoClicado.id;
    console.log('id UE:', idUE);
    if(!menuButton )    setMenBut(!menuButton);
    if(elementoClicado.id){
      setMenBut2(idUE)
    }


  }
  function viajesuliChat(){
    window.location.replace("/chatuser")
  }
  function handleMensajeria() {
    setMostrarMensajeria(!mostrarMensajeria);
  }

 
  const updateBuildingCount = async ( cantidad: number, costos: number, id: string) => {
    let countsMax = 0;

        const count =  (await getBuildingCount(userId, id)).length;
        const user = await getUserById(userId);
        let madera = Number(user?.madera);
        let piedra = Number(user?.piedra);
        let pan = Number(user?.pan);
          
        if (costos <= madera && costos <= piedra && cantidad >= count) {
            countsMax = 1;
            madera -= costos;
            piedra -= costos;
            // Update user resources
            await updateUserRecursos(userId, madera, piedra, pan);
            setMessage('Edificio construido exitosamente.');
        } else {
          if (madera < costos && piedra < costos) {
            setMessage('No tienes suficiente madera y piedra para construir.');
        } else if (madera < costos) {
            setMessage('No tienes suficiente madera para construir.');
        } else if (piedra < costos) { // Corrected condition to piedra < costos
            setMessage('No tienes suficiente piedra para construir.');
        } else if (cantidad <= count) {
            setMessage('Ya tienes el máximo de este edificio.');
        }
          
        }
    

    return countsMax;
};

  



return (
  <div className="hola flex flex-col items-center justify-center w-screen h-screen bg-gray-900">
    <div className="absolute top-0 left-0 p-4 bg-red-500 text-blue font-bold py-2 px-4 rounded">
      <h3>Usuario: {userId}</h3>
      <h3>Usuario: {usuario}</h3>
      <h3>Madera: {madera}</h3>
      <h3>Piedra: {piedra}</h3>

      <h3>Pan: {pan}</h3>
      <h3>Trabajadores disponibles: {unidadesDisponibles}</h3>
      <button onClick={() => recolectarRecursosUser()}>Recolectar Recursos</button>    
    </div>
  
    <div className='absolute top-0 left-100 p-4 bg-red-500 hover:bg-blue-700 text-blue font-bold py-2 px-4 rounded'>
      <button onClick={() => handleMensajeria()}>Chat</button>
    </div>

    <Mensajeria
      mostrarMensajeria={mostrarMensajeria}
      userLoaded={userLoaded}
      chats={chats}
      chatnames={chatnames}
      handleMensajeria={handleMensajeria}
      getMensajes={getMensajes}
    />

    <div style={{ width: '1200px', height: '700px' }} className="bg-green-500 flex items-center justify-center relative">
      {buildings.map((building, index) => (
        <div
          key={index}
          id={building.id}
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`}
          style={{
            left: `${building.x}px`,
            top: `${building.y}px`,
            width: `${building.ancho}px`,
            height: `${building.largo}px`,
            transform: 'rotateX(45deg) rotateZ(-45deg)',
            transformOrigin: 'center center',
            position: 'absolute',
            cursor: 'pointer',
          }}
          onMouseDown={(e) => handleMouseDown(index, e)}
          onClick={(e) => handleClick(e)}  
        >
          <div>{building.costo} - X: {building.x}, Y: {building.y}</div>
        </div>
      ))}
      
      <div id="messageDiv" style={messageDivStyle}  className="absolute top-0 left-1/2 transform -translate-x-1/2 p-4 bg-yellow-500 text-black font-bold py-2 px-4 rounded z-50">
        {message}
      </div>
    </div>
    
    <button
      className="absolute bottom-4 right-4 bg-green-500 hover:bg-white text-white font-bold py-2 px-4 rounded"
      onClick={handleMenuClick}
    >
      Menú
    </button>

    {menuOpen && <MenuDesplegable onBuildClick={handleBuildClick} />}
  </div>
);
};

export default DynamicBuildings;
