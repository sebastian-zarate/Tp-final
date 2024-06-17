import React, { useState, useEffect } from 'react';
import { getEdificios } from '../../services/edificios';

interface Props {
  onBuildClick: (id: string, x: number, y: number, buildingType: string, ancho: number, largo: number, costo:number, cantidad: number) => void;
}

const MenuDesplegable: React.FC<Props> = ({ onBuildClick }) => {
  const [edificios, setEdificios] = useState<any[]>([]);
  


  useEffect(() => {
    fetchBuildingData();
  }, []);

  async function fetchBuildingData() {
    try {
      // Obtener los datos de los edificios desde la base de datos
    
       
      const edificiosData = await getEdificios();
      setEdificios(edificiosData);
    } catch (error) {
      console.error("Error al obtener datos de edificios:", error);
    }
  };







  // Función para llamar a la función onBuildClick con el tipo de edificio seleccionado
  const handleBuildSelection = (buildingType: string) => {
    const selectedEdificio = edificios.find(edificio => edificio.name === buildingType);
    if (selectedEdificio) {
      // Aquí puedes definir las coordenadas x, y donde quieres construir el edificio
      const x = 100; // Por ejemplo, 100px desde el borde izquierdo del cuadro verde
      const y = 100; // Por ejemplo, 100px desde el borde superior del cuadro verde
      const ancho = selectedEdificio.ancho ; // Usar ancho predeterminado si no está definido en la base de datos
      const largo = selectedEdificio.largo ; // Usar largo predeterminado si no está definido en la base de datos
      const costo = selectedEdificio.costo ; // Usar costo predeterminado si no está definido en la base de datos
      const cantidad = selectedEdificio.cantidad;
      onBuildClick(selectedEdificio.id, x, y, buildingType, ancho, largo, costo, cantidad);
    } else {
      console.error(`No se encontró el edificio con el nombre "${buildingType}"`);
    }
  };

  return (
    <div className=" flex absolute  justify-center items-center bg-red-500 text-blue font-bold  px-4 rounded">

      {/* Renderizar los botones para seleccionar el tipo de edificio */}
      {edificios.map((edificio, index) => (
        <div className=' py-6 flex flex-col items-center border' key={index}>
          <button className='x-2 p-4  hover:bg-blue-700 ' onClick={() => handleBuildSelection(edificio.name)}>{edificio.name}</button>
          <span className=' absolute text-sm text-black bottom-0'>Precio: {edificio.costo}</span>
        </div>
      ))}
    </div>
  );
};

export default MenuDesplegable;