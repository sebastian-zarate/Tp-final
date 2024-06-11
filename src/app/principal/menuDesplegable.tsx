import React, { useState, useEffect } from 'react';
import { getEdificios } from '../../services/edificios';

interface Props {
  onBuildClick: (id: string, x: number, y: number, buildingType: string, ancho: number, largo: number, nivel: number, costo: number, cantidad:number) => void;
}

const MenuDesplegable: React.FC<Props> = ({ onBuildClick }) => {
  const [edificios, setEdificios] = useState<any[]>([]);

  useEffect(() => {
    fetchBuildingData();
  }, []);

  async function fetchBuildingData() {
    try {
      const edificiosData = await getEdificios();
      setEdificios(edificiosData);
    } catch (error) {
      console.error("Error al obtener datos de edificios:", error);
    }
  };

  // Función para llamar a la función onBuildClick con el tipo de edificio seleccionado
  const handleBuildSelection = (buildingType: string) => {
    const selectedEdificio = edificios.find(edificio => edificio.name === buildingType );
    if (selectedEdificio) {
      // Aquí puedes definir las coordenadas x, y donde quieres construir el edificio
      const x = 100; // Por ejemplo, 100px desde el borde izquierdo del cuadro verde
      const y = 100; // Por ejemplo, 100px desde el borde superior del cuadro verde
      const ancho = selectedEdificio.ancho || 20; // Usar ancho predeterminado si no está definido en la base de datos
      const largo = selectedEdificio.largo || 20; // Usar largo predeterminado si no está definido en la base de datos
      onBuildClick(selectedEdificio.id, x, y, buildingType, ancho, largo, selectedEdificio.nivel, selectedEdificio.costo, selectedEdificio.cantidad);
    } else {
      console.error(`No se encontró el edificio con el nombre "${buildingType}"`);
    }
  };

  return (
    <div className=" flex bg-red-500 text-blue font-bold  px-4 rounded">

      {/* Renderizar los botones para seleccionar el tipo de edificio */}
      {edificios.map((edificio, index) => (
        <div className='flex flex-col items-center border' key={index}>
          <button key={index} className='x-2 p-4  hover:bg-blue-700 ' onClick={() => handleBuildSelection(edificio.name)}>{edificio.name}</button>
          <span className=' text-sm text-black ' key={index}>Precio: {edificio.costo}</span>
        </div>
      ))}
    </div>
  );
};

export default MenuDesplegable;