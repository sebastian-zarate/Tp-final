'use client'
import React, { useState, useEffect, useRef, use } from 'react';
import MenuDesplegable from './menuDesplegable';
import MenuAsignar from './menuAsignar';
import Mensajeria from './menuChats';
import { GuardarEdificio, getBuildingsByUserId, builtEdificio, getUEbyUserId, getUEById } from '../../services/userEdificios';
import { getUserByCooki, getUser, getUserByHash} from '@/services/users';
import {recolectarRecursos } from '@/services/recursos';
import { getChats, getUsernameOther, getChatName } from '@/services/chats';
import { getMensajes } from '@/services/mensajes';


type Building = {
  x: number;
  y: number;
  type: string;
  ancho: number;
  largo: number;
  id: string;
  nivel: number;
  costo: number;
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


  //este método obtiene el dato recibido del hijo menuAsignar, el cual será usado para setear cerrar el botón
  const recibirDatosDelHijo = (datos: any) => {
    console.log("datos222", datos)
     setMenBut(!menuButton);
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
  
  const handleBuildClick = async (id: string, x: number, y: number, buildingType: string, ancho: number, largo: number, nivel: number) => {
    const newBuilding = { id, x, y, type: buildingType, ancho, largo, nivel, costo: 0};
    const collisionIndex = getCollidedBuildingIndex(-1, x, y, ancho, largo);

    if (collisionIndex === -1) {
      setBuildings([...buildings, newBuilding]);

      // Llamar a la función para guardar el edificio en la base de datos
      try {
        await builtEdificio(id, x, y, nivel);
        console.log('Edificio guardado exitosamente en la base de datos.');
      } catch (error) {
        console.error('Error al guardar el edificio en la base de datos:', error);
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

  const handleBuildingMove = (index: number, newX: number, newY: number) => {
    setBuildings(prevBuildings => {
      const updatedBuildings = [...prevBuildings];
      const maxWidth = 1200; // Ancho del área de construcción
      const maxHeight = 700; // Alto del área de construcción
      const buildingWidth = updatedBuildings[index].ancho; // Ancho de cada edificio
      const buildingHeight = updatedBuildings[index].largo; // Alto de cada edificio

      // Limitar las coordenadas x e y dentro del área de construcción
      const clampedX = Math.min(Math.max(newX, 0)+20, maxWidth - buildingWidth);
      const clampedY = Math.min(Math.max(newY, 0), maxHeight - buildingHeight);

      // Ajustar la posición si colisiona con otros edificios
      const collisionIndex = getCollidedBuildingIndex(index, clampedX, clampedY, buildingWidth, buildingHeight);
      if (collisionIndex !== -1) {
        const collidedBuilding = updatedBuildings[collisionIndex];
        const deltaX = clampedX - collidedBuilding.x;
        const deltaY = clampedY - collidedBuilding.y;

        // Calcular la dirección de desplazamiento y ajustar la posición del edificio
        let newClampedX = clampedX;
        let newClampedY = clampedY;

        if (Math.abs(deltaX) < Math.abs(deltaY)) {
          // Desplazamiento horizontal
          newClampedX = collidedBuilding.x + (deltaX > 0 ? collidedBuilding.ancho : -buildingWidth);
        } else {
          // Desplazamiento vertical
          newClampedY = collidedBuilding.y + (deltaY > 0 ? collidedBuilding.largo : -buildingHeight);
        }

        // Limitar las coordenadas x e y dentro del área de construcción después del ajuste
        updatedBuildings[index].x = Math.min(Math.max(newClampedX, 0), maxWidth - buildingWidth);
        updatedBuildings[index].y = Math.min(Math.max(newClampedY, 0), maxHeight - buildingHeight);
      } else {
        updatedBuildings[index].x = clampedX;
        updatedBuildings[index].y = clampedY;
      }
      return updatedBuildings;
    });
  };

  const getCollidedBuildingIndex = (index: number, x: number, y: number, width: number, height: number) => {
    return buildings.findIndex((building, i) =>
      i !== index &&
      x < building.x + building.ancho &&
      x + width > building.x &&
      y < building.y + building.largo &&
      y + height > building.y
    );
  };


  const guardarEdificioEnBD = (id: string, posX: number, posY: number, nivel : number) => {
    GuardarEdificio(id, posX, posY, nivel);
  };

  const guardarAldea = () => {
    buildings.forEach(building => {
      guardarEdificioEnBD(building.id, building.x, building.y, building.nivel);
    });
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

  return (
    <div className="hola flex flex-col items-center justify-center w-screen h-screen bg-gray-900">
      <div className="absolute top-0 left-0 p-4 bg-red-500 text-blue font-bold py-2 px-4 rounded">
        <h3>Usuario: {usuario}</h3>
        <h3>Madera: {madera}</h3>
        <h3>Piedra: {piedra}</h3>
        <h3>Pan: {pan}</h3>
        <h3>Trabajadores disponibles: {unidadesDisponibles}</h3>
        <button onClick={() => recolectarRecursosUser()}> Recolectar Recursos</button>        
      </div>
      <div className='absolute top-0 left-100 p-4 bg-red-500 hover:bg-blue-700 text-blue font-bold py-2 px-4 rounded'>
        <button onClick={() => handleMensajeria()}>Chat</button>
      </div>
      <Mensajeria
        userId= {userId}
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
            className={` bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`}
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
           
            <div>{building.type} - X: {building.x}, Y: {building.y}</div>
            {/* Si el id seleccionado es el mismo al id del UE, y si menuButoon esta habilitado entonces abrir el form del boton */}
              {( (menuButton2 == building.id)&&menuButton ) ? <MenuAsignar  datos= {building.id} enviarDatosAlPadre={recibirDatosDelHijo}/> : null  }
  
          </div>

        ))}
      </div>
      <button
        className="absolute bottom-4 right-4 bg-green-500 hover:bg-white text-white font-bold py-2 px-4 rounded"
        onClick={handleMenuClick}
      >
        Menú
      </button>
      {menuOpen && <MenuDesplegable onBuildClick={handleBuildClick} />}


      <button
        className="absolute bottom-4 left-4 bg-blue-500 hover:bg-white text-white font-bold py-2 px-4 rounded"
        onClick={guardarAldea}
      >
        Guardar Aldea
      </button>
    </div>
  );
};

export default DynamicBuildings;
