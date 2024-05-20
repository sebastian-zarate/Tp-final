'use client'
import React, { useState, useEffect } from 'react';
import { getEdificios, GuardarEdificio } from '../../services/edificios';
import { calcularRecursosGenerados } from '@/services/recursos';

interface Building {
  x: number;
  y: number;
  type: string;
  id: string; // Añade el id del edificio
}

const EdificioBuildings = () => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<{name: string, id: string} | null>(null);
  const [draggedBuildingIndex, setDraggedBuildingIndex] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [buildingOptions, setBuildingOptions] = useState<{name: string, id: string}[]>([]);
  const [madera, setMadera] = useState(0);

  useEffect(() => {
    async function fetchBuildingData() {
      try {
        const res = await getEdificios();
        const options = res.map((edificio: any) => ({ name: edificio.name, id: edificio.id }));
        setBuildingOptions(options);
      } catch (error) {
        console.error("Error al obtener nombres de edificios:", error);
      }
    }
    fetchBuildingData();
  }, []);

  const handleBuildClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedBuilding) return;

    const x = event.clientX;
    const y = event.clientY;

    // Verificar si ya se construyó el edificio
    const isBuildingConstructed = buildings.some(building => building.id === selectedBuilding.id);
    if (!isBuildingConstructed) {
      setBuildings([...buildings, { x, y, type: selectedBuilding.name, id: selectedBuilding.id }]);
    }

    setSelectedBuilding(null); // Limpiar la selección de edificio después de construir
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
    const selectedOption = buildingOptions.find(option => option.name === event.target.value);
    setSelectedBuilding(selectedOption || null);
    console.log("Edificio seleccionado:", event.target.value);
  };

  const handleDeleteBuilding = (index: number) => {
    const filteredBuildings = buildings.filter((_, i) => i !== index);
    setBuildings(filteredBuildings);
  };

  const handleCreateBuilding = (buildingOption: {name: string, id: string}) => {
    setSelectedBuilding(buildingOption);
    handleBuildClick({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 } as React.MouseEvent<HTMLDivElement>);
  };

  const recolectarRecursos = async () => {
    const recursos = await calcularRecursosGenerados();
    console.log("Recursos generados:", recursos);
    setMadera(madera + recursos);
  }

  const guardarAldea = () => {
    buildings.forEach((building) => {
      GuardarEdificio(building.id, building.x, building.y); // Guardar el id del edificio
    });
  };

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
            position: 'absolute',
          }}
          onMouseDown={(event) => handleMouseDown(event, index)}
        >
          <div>{building.type} - X: {building.x}, Y: {building.y}</div>
          <button onClick={() => handleDeleteBuilding(index)}>Eliminar</button>
        </div>
      ))}
      <div className="absolute top-0 left-0 p-4 bg-red-500 hover:bg-blue-700 text-blue font-bold py-2 px-4 rounded">
        <h3>Madera: {madera}</h3>
        <button onClick={recolectarRecursos}>Recolectar Recursos</button>
      </div>
      <div className="absolute top-0 right-0 p-4 bg-red-500 hover:bg-blue-700 text-blue font-bold py-2 px-4 rounded">
        <h3>Crear edificios</h3>
        {buildingOptions.map((buildingOption, index) => (
          <div key={index}>
            <button onClick={() => handleCreateBuilding(buildingOption)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              {buildingOption.name}
            </button>
          </div>
        ))}
      </div>
      <button
        className="absolute bottom-4 left-4 bg-blue-500 hover:bg-white text-white font-bold py-2 px-4 rounded"
        onClick={guardarAldea}
      >
        Guardar Aldea
      </button>
    </div>
  );
};

export default EdificioBuildings;
