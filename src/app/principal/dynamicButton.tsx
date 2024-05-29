'use client'
import React, { useState, useEffect, useRef,useMemo } from 'react';
import MenuDesplegable from './menuDesplegable';
import { GuardarEdificio, getBuildingsByUserId, builtEdificio  } from '../../services/userEdificios';
import { getUser} from '@/services/users';
import { getEdificios } from '../../services/edificios';
import {recolectarRecursos } from '@/services/recursos';
import Edificios from '../recursos/page';

type Building = {
  x: number;
  y: number;
  type: string;
  ancho: number;
  largo: number;
  id: string;
};

const DynamicBuildings: React.FC = () => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [draggedBuildingIndex, setDraggedBuildingIndex] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [madera, setMadera] = useState(0);
  const [piedra, setPiedra] = useState(0);
  const [pan, setPan] = useState(0);
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

  const handleBuildClick = async (id: string, x: number, y: number, buildingType: string, ancho: number, largo: number ) => {
    const existingBuilding = buildings.find(building => building.x === x && building.y === y && building.id === id);
  
    if (!existingBuilding) {
      const newBuilding = { id, x, y, type: buildingType, ancho, largo};
      setBuildings([...buildings, newBuilding]);

      // Llamar a la función para guardar el edificio en la base de datos
      try {
        await  builtEdificio(id, x, y,1);
        
        console.log('Edificio guardado exitosamente en la base de datos.');
        window.location.reload();
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
  
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  //let timeoutId: NodeJS.Timeout | null = null;

const handleBuildingMove = (index: number, newX: number, newY: number) => {
  setBuildings(prevBuildings => {
    const updatedBuildings = [...prevBuildings];
    const maxWidth = 1170; // Ancho del área de construcción
    const maxHeight = 700; // Alto del área de construcción
    const buildingWidth = updatedBuildings[index].ancho; // Ancho de cada edificio
    const buildingHeight = updatedBuildings[index].largo; // Alto de cada edificio
    const collisionMargin = 10; // Margen de colisión entre edificios

    // Limitar las coordenadas x e y dentro del área de construcción
    const clampedX = Math.min(Math.max(newX, 0) + 20, maxWidth - buildingWidth);
    const clampedY = Math.min(Math.max(newY, 0), maxHeight - buildingHeight);

    // Ajustar la posición si colisiona con otros edificios
    const collidedBuildingIndex = getCollidedBuildingIndex(index, clampedX, clampedY, buildingWidth, buildingHeight);
    if (collidedBuildingIndex !== -1) {
      // Lógica de manejo de colisiones...
    } else {
      // Actualizar la posición del edificio directamente
      updatedBuildings[index].x = clampedX;
      updatedBuildings[index].y = clampedY;

      // Cancelar la solicitud anterior si existe
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }

      // Programar una nueva solicitud después de 500 ms
      timeoutId = setTimeout(() => {
        guardarEdificioEnBD(updatedBuildings[index].id, clampedX, clampedY);
        
        timeoutId = null;
      }, 500); // Ajusta este valor según tus necesidades
    }

    return updatedBuildings;
  });
};

 
  
  const getCollidedBuildingIndex = (index: number, x: number, y: number, width: number, height: number) => {
    const updatedBuildings = buildings.filter((_, i) => i !== index); // Excluir el edificio actual
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

  const guardarAldea = () => {
    buildings.forEach((building, index) => {
      guardarEdificioEnBD(`${building.id}`, building.x, building.y);
    });
  };

  
  const recolectarRecursosUser = async () => {
    const user = await getUser("6645239328fab0b97120439e")
    if(user != null){
      await recolectarRecursos(user.id);
      setMadera(user.madera);
      setPiedra(user.piedra);
      setPan(user.pan);
    }
  }
  const cargarUser = async () => {
    const user = await getUser("6645239328fab0b97120439e")
    if(user != null){
      setMadera(user.madera);
      setPiedra(user.piedra);
      setPan(user.pan);
      setUser(String (user.username));
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-gray-900">
      <div className="absolute top-0 left-0 p-4 bg-red-500 hover:bg-blue-700 text-blue font-bold py-2 px-4 rounded">
        <h3>Usuario: {usuario}</h3>
        <h3>Madera: {madera}</h3>
        <h3>Piedra: {piedra}</h3>
        <h3>Pan: {pan}</h3>
        <button onClick={() => recolectarRecursosUser()}> Recolectar Recursos</button>
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
            <div>{building.id} - X: {building.x}, Y: {building.y}</div>
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