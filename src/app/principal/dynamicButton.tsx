'use client'
import React, { useState, useEffect, useRef } from 'react';
import MenuDesplegable from './menuDesplegable';
import { GuardarEdificio, getUEbyUserId } from '../../services/userEdificios'; //faltan estos 2
import { getUser} from '@/services/users';
import { getEdificios } from '../../services/edificios';
import {recolectarRecursos } from '@/services/recursos';

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
  const [usuario, setUser] = useState('');
  

  const mouseMoveRef = useRef<(e: MouseEvent) => void>(() => {});
  const mouseUpRef = useRef<() => void>(() => {});

  useEffect(() => {
    const userId = 'tu_id_de_usuario'; // Reemplazar con el ID de usuario actual
    cargarUser();
    getUEbyUserId(userId)
      .then(fetchedBuildings => {
        setBuildings(fetchedBuildings);
      })
      .catch(error => {
        console.error("Error fetching buildings:", error);
      });
  }, []);

  const handleBuildClick = (x: number, y: number, buildingType: string, ancho: number, largo: number) => {
    const existingBuilding = buildings.find(building => building.x === x && building.y === y && building.type === buildingType);
  
    if (!existingBuilding) {
      // Crear un nuevo edificio con un ID único
      const newBuilding = { x, y, type: buildingType, ancho, largo };
      
      // Actualizar el estado utilizando una función de callback para asegurar el valor actualizado de buildings
      setBuildings(prevBuildings => {
        const updatedBuildings = [...prevBuildings, newBuilding];
        // Llamar a la función para guardar el edificio en la base de datos con el ID correcto
        guardarEdificioEnBD(`${buildingType}-${updatedBuildings.length}`, x, y);
        return updatedBuildings;
      });
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
      const collisionMargin = 10; // Margen de colisión entre edificios
  
      // Limitar las coordenadas x e y dentro del área de construcción
      const clampedX = Math.min(Math.max(newX, 0), maxWidth - buildingWidth);
      const clampedY = Math.min(Math.max(newY, 0), maxHeight - buildingHeight);
  
      // Ajustar la posición si colisiona con otros edificios
      const collidedBuildingIndex = getCollidedBuildingIndex(index, clampedX, clampedY, buildingWidth, buildingHeight);
      if (collidedBuildingIndex !== -1) {
        const collidedBuilding = updatedBuildings[collidedBuildingIndex];
        const deltaX = clampedX - collidedBuilding.x;
        const deltaY = clampedY - collidedBuilding.y;
        
        // Calcular la dirección de desplazamiento y ajustar la posición del edificio
        let newX = clampedX;
        let newY = clampedY;
  
        if (Math.abs(deltaX) < Math.abs(deltaY)) {
          // Desplazamiento horizontal
          newX = collidedBuilding.x + (deltaX > 0 ? collidedBuilding.ancho + collisionMargin : -buildingWidth - collisionMargin);
        } else {
          // Desplazamiento vertical
          newY = collidedBuilding.y + (deltaY > 0 ? collidedBuilding.largo + collisionMargin : -buildingHeight - collisionMargin);
        }
  
        // Limitar las coordenadas x e y dentro del área de construcción después del ajuste
        newX = Math.min(Math.max(newX, 0), maxWidth - buildingWidth);
        newY = Math.min(Math.max(newY, 0), maxHeight - buildingHeight);
  
        updatedBuildings[index].x = newX;
        updatedBuildings[index].y = newY;
      } else {
        updatedBuildings[index].x = clampedX;
        updatedBuildings[index].y = clampedY;
      }
      return updatedBuildings;
    });
  };

  const handleCreateBuilding = (buildingName: string) => {
    setSelectedBuilding(buildingName);
    handleBuildClick({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 } as React.MouseEvent<HTMLDivElement>);
  };

  const recolectarRecursos = async () => {
    const recursos = await calcularRecursosGenerados();
    console.log("Recursos generados:", recursos);
    setMadera(madera + recursos);
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
            <div>{building.type} - X: {building.x}, Y: {building.y}</div>
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
