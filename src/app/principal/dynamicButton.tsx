'use client'
import React, { useState, useEffect, useRef } from 'react';
import MenuDesplegable from './menuDesplegable';
import { GuardarEdificio, getBuildingsByUserId, builtEdificio } from '../../services/userEdificios';
import { getUser, updateUserBuildings } from '@/services/users'; // Asegúrate de importar updateUserBuildings
import { getEdificios } from '../../services/edificios';
import { recolectarRecursos } from '@/services/recursos';
import Edificios from '../recursos/page';
import { Piedra } from 'next/font/google';

type Building = {
  x: number;
  y: number;
  type: string;
  ancho: number;
  largo: number;
  id: string;
  cantidad: number;
  costo: number;
};

const DynamicBuildings: React.FC = () => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [draggedBuildingIndex, setDraggedBuildingIndex] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [madera, setMadera] = useState(0);
  const [piedra, setPiedra] = useState(0);
  const [pan, setPan] = useState(0);
  const [canon, setCanon] = useState(0);
  const [maderera, setMaderera] = useState(0);
  const [cantera, setCantera] = useState(0);
  const [panaderia, setPanaderia] = useState(0);
  const [bosque, setBosque] = useState(0);
  const [muros, setMuros] = useState(0);
  const [ayuntamiento, setAyuntamiento] = useState(0);
  const [herreria, setHerreria] = useState(0);
  const [costo, setCosto] = useState(0);

  const [usuario, setUser] = useState<string | null>(null);

  const mouseMoveRef = useRef<(e: MouseEvent) => void>(() => {});
  const mouseUpRef = useRef<() => void>(() => {});

  useEffect(() => {
    const userId = '6645239328fab0b97120439e'; // Reemplazar con el ID de usuario actual
    const fetchUser = async () => {
      const user = await getUser(userId);
      if (user) {
        setUser(user.username);
        setMadera(user.madera);
        setPiedra(user.piedra);
        setPan(user.pan);
        setCanon(user.canon);
        setMaderera(user.maderera);
        setCantera(user.cantera);
        setPanaderia(user.panaderia);
        setBosque(user.bosque);
        setMuros(user.muros);
        setAyuntamiento(user.ayuntamiento);
        setHerreria(user.herreria);
        
      }
    };
    getBuildingsByUserId(userId)
      .then(fetchedBuildings => {
        setBuildings(fetchedBuildings);
      })
      .catch(error => {
        console.error("Error fetching buildings:", error);
      });
    fetchUser();
  }, []);




  const handleBuildClick = async (id: string, x: number, y: number, buildingType: string, ancho: number, largo: number, costos: number) => {
   const existingBuilding = false //buildings.find(building => building.x === x && building.y === y && building.id === id);
     
    if (!existingBuilding) {
      
        console.log('Construyendo edificio...', buildingType);
        console.log('Costo:', costos);
      // Actualizar el estado del usuario
      const construir = await updateBuildingCount(id, costos); // devuelve 1 si se puede construir, 0 si no
       // window.location.reload();
      // Llamar a la función para guardar el edificio en la base de datos
      if (construir === 1) {
        buildings.find(building => building.x === x && building.y === y && building.id === id);
        window.location.reload();
        const newBuilding = { id, x, y, type: buildingType, ancho, largo, cantidad: 1 };
        setBuildings([...buildings, newBuilding,]);
        try {
          // Evita recargar la página, en su lugar actualiza el estado
          await builtEdificio(id, x, y, 1);
          console.log('Edificio guardado exitosamente en la base de datos.');
         
        } catch (error) {
          console.error('Error al guardar el edificio en la base de datos:', error);
        }
      }
    } else {
      console.log('Ya hay un edificio del mismo tipo en estas coordenadas');
    }
  };
  
  const updateBuildingCount = async (id: string, costos: number) => {
    const userId = '6645239328fab0b97120439e'; // Reemplazar con el ID de usuario actual
    let countsMax = 0;
    
    const newCounts = {
      canon,
      maderera,
      cantera,
      panaderia,
      bosque,
      muros,
      ayuntamiento,
      herreria,
      pan,
      madera,
      piedra,
    };
  
    switch (id) {
      case '663ac05e044ccf6167cf703c':
        if (canon < 3 && piedra >= costos) {
          
          newCounts.canon += 1;// sumo 1  a la cantidad de cañones
         
          
          newCounts.piedra = (piedra - costos); // Deduct costos from piedra
          setCanon(newCounts.canon);
           
          setPiedra(newCounts.piedra);
          
          countsMax = 1;
        } else {
          console.log('No puedes tener más de 3 cañones o no tienes suficiente piedra');
        }
        break;
      case '663ac05f044ccf6167cf7041':
        if (maderera < 3 && madera >= costos) {
          newCounts.maderera += 1;
          setMaderera(newCounts.maderera);
          newCounts.madera = (madera - costos);
          setMadera(newCounts.madera);
          countsMax = 1;
        } else {
          console.log('Condition for maderera not met');
        }
        break;
      case '663ac05f044ccf6167cf7040':
        if (cantera < 3) {
          newCounts.cantera += 1;
          setCantera(newCounts.cantera);
          countsMax = 1;
        } else {
          console.log('Condition for cantera not met');
        }
        break;
      case '663ac518044ccf6167cf7054':
        if (panaderia < 3 && pan >= costos) {
          newCounts.panaderia += 1;
          newCounts.pan = (pan - costos);
          setPanaderia(newCounts.panaderia);
          setPan(newCounts.pan);
          countsMax = 1;
        } else {
          console.log('Condition for panaderia not met');
        }
        break;
      case '663ac060044ccf6167cf7042':
        if (bosque < 3) {
          newCounts.bosque += 1;
          setBosque(newCounts.bosque);
          countsMax = 1;
        } else {
          console.log('Condition for bosque not met');
        }
        break;
      case '663ac05f044ccf6167cf703e':
        if (muros < 3) {
          newCounts.muros += 1;
          setMuros(newCounts.muros);
          countsMax = 1;
        } else {
          console.log('No puedes tener más de 3 muros');
        }
        break;
      case '663ac05f044ccf6167cf703d': // ayuntamiento (changed ID)
        if (ayuntamiento < 1) {
          newCounts.ayuntamiento += 1;
          setAyuntamiento(newCounts.ayuntamiento);
          countsMax = 1;
        } else {
          console.log('Condition for ayuntamiento not met');
        }
        break;
      case '663ac05f044ccf6167cf703f':
        
        if (herreria < 3) {
          newCounts.herreria += 1;
          setHerreria(newCounts.herreria);
          countsMax = 1;
        } else {
          console.log('Condition for herreria not met');
        }
        break;
    }
  
    try {
      await updateUserBuildings(
        userId,
        newCounts.canon,
        newCounts.muros,
        newCounts.bosque,
        newCounts.herreria,
        newCounts.cantera,
        newCounts.maderera,
        newCounts.panaderia,
        newCounts.ayuntamiento,
        newCounts.pan,
        newCounts.madera,
        newCounts.piedra,
      );
      console.log('User buildings count updated successfully.');
    } catch (error) {
      console.error('Error updating user buildings count:', error);
    }

    return countsMax;
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
      const updatedBuildings = [...prevBuildings];
      const maxWidth = 1170;
      const maxHeight = 700;
      const buildingWidth = updatedBuildings[index].ancho;
      const buildingHeight = updatedBuildings[index].largo;

      const clampedX = Math.min(Math.max(newX, 0) + 20, maxWidth - buildingWidth);
      const clampedY = Math.min(Math.max(newY, 0), maxHeight - buildingHeight);

      const collidedBuildingIndex = getCollidedBuildingIndex(index, clampedX, clampedY, buildingWidth, buildingHeight);
      if (collidedBuildingIndex !== -1) {
        // Lógica de manejo de colisiones...
      } else {
        updatedBuildings[index].x = clampedX;
        updatedBuildings[index].y = clampedY;

        if (timeoutId !== null) {
          clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
          guardarEdificioEnBD(updatedBuildings[index].id, clampedX, clampedY);
          timeoutId = null;
        }, 500);
      }

      return updatedBuildings;
    });
  };

  const getCollidedBuildingIndex = (index: number, x: number, y: number, width: number, height: number) => {
    const updatedBuildings = buildings.filter((_, i) => i !== index);
    return updatedBuildings.findIndex(building =>
      x < building.x + building.ancho &&
      x + width > building.x &&
      y < building.y + building.largo &&
      y + height > building.y
    );
  };

  const guardarEdificioEnBD = (id: string, posX: number, posY: number) => {
    GuardarEdificio(id, posX, posY, 2);
  };

 

  const recolectarRecursosUser = async () => {
    const userId = '6645239328fab0b97120439e'; // Reemplazar con el ID de usuario actual
    const user = await getUser(userId);
    if (user != null) {
      await recolectarRecursos(user.id);
      setMadera(user.madera);
      setPiedra(user.piedra);
      setPan(user.pan);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-gray-900">
      <div className="absolute top-0 left-0 p-4 bg-red-500 hover:bg-blue-700 text-blue font-bold py-2 px-4 rounded">
        <h3>Usuario: {usuario}</h3>
        <h3>Madera: {madera}</h3>
        <h3>Piedra: {piedra}</h3>
        <h3>Pan: {pan}</h3>
        <h3>canon: {canon}</h3>
        <h3>maderera: {maderera}</h3>
        <h3>cantera: {cantera}</h3>
        <h3>panaderia: {panaderia}</h3>
        <h3>bosque: {bosque}</h3>
        <h3>muros: {muros}</h3>
        <h3>ayuntamiento: {ayuntamiento}</h3>
        <h3>herreria: {herreria}</h3>
        <button className="bg-green-500" onClick={recolectarRecursosUser}> Recolectar Recursos</button>
      </div>
      <div style={{ width: '1200px', height: '700px' }} className="bg-green-500 flex items-center justify-center relative">
        {buildings.map((building, index) => (
          <div
            key={index}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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
          >
            <div>{building.costo} - X: {building.x}, Y: {building.y}</div>
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
    </div>
  );
};

export default DynamicBuildings;
