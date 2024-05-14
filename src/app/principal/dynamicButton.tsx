'use client'
import React, { useState, useEffect } from 'react';
import { getEdificios } from '../../services/edificios';
import { calcularRecursosGenerados } from '@/services/recursos';

interface Building {
  x: number;
  y: number;
  type: string;
}

const DynamicBuildings: React.FC = () => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [draggedBuildingIndex, setDraggedBuildingIndex] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [buildingNames, setBuildingNames] = useState<string[]>([]); // Aquí guardaremos los nombres de los edificios
  //recursos
  const [madera, setMadera] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getEdificios();
        const names = res.map(edificio => edificio.name);
        setBuildingNames(names);
        console.log("buildingNames actualizado:", names);
      } catch (error) {
        console.error("Error al obtener nombres de edificios:", error);
      }
    };
    fetchData();
  }, []); // Esta función se ejecuta solo una vez al montar el componente

  const handleBuildClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedBuilding) return;

    const x = event.clientX;
    const y = event.clientY;

    // Verificar si ya se construyó el edificio
    const isBuildingConstructed = buildings.some(building => building.type === selectedBuilding);
    if (!isBuildingConstructed) {
      setBuildings([...buildings, { x, y, type: selectedBuilding }]);
    }

    setSelectedBuilding(''); // Limpiar la selección de edificio después de construir
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>, index: number) => {
    setDraggedBuildingIndex(index);
    const x = event.clientX;
    const y = event.clientY;
    const buildingX = buildings[index].x;
    const buildingY = buildings[index].y;
    setDragOffset({ x: x - buildingX, y: y - buildingY });
  };

  const handleMouseUp = () => {
    setDraggedBuildingIndex(null);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (draggedBuildingIndex !== null) {
      const x = event.clientX;
      const y = event.clientY;
      const newBuildings = [...buildings];
      newBuildings[draggedBuildingIndex].x = x - dragOffset.x;
      newBuildings[draggedBuildingIndex].y = y - dragOffset.y;
      setBuildings(newBuildings);
    }
  };

  const handleBuildingSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBuilding(event.target.value);
  };

  const handleDeleteBuilding = (index: number) => {
    const filteredBuildings = buildings.filter((_, i) => i !== index);
    setBuildings(filteredBuildings);
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
  return (
    <div
      className="relative flex justify-center items-center h-screen bg-green-500"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {buildings.map((building, index) => (
        <div
          key={index}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          style={{
            left: `${building.x}px`,
            top: `${building.y}px`,
            transform: 'rotateX(45deg) rotateZ(-45deg)',
            transformOrigin: 'center center',
            position: 'absolute', // Agregamos esta propiedad para posicionar los botones absolutamente
          }}
          onMouseDown={(event) => handleMouseDown(event, index)}
        >
          <div>{building.type} - X: {building.x}, Y: {building.y}</div>
          <button onClick={() => handleDeleteBuilding(index)}>Eliminar</button>
        </div>
      ))}
      <div className="absolute top-0 left-0 p-4 bg-red-500 hover:bg-blue-700 text-blue font-bold py-2 px-4 rounded">
        <h3>Madera: {madera}</h3>
        <button onClick={recolectarRecursos}> Recolectar Recursos</button>
      </div>
      <div className="absolute top-0 right-0 p-4 bg-red-500 hover:bg-blue-700 text-blue font-bold py-2 px-4 rounded">
        <h3>Crear edificios</h3>
        {buildingNames.map((buildingName, index) => (
          <div key={index}>
            <button onClick={() => handleCreateBuilding(buildingName)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              {buildingName}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DynamicBuildings;