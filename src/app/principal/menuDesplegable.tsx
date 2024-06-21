import React, { useState, useEffect } from 'react';
import { getEdificios } from '../../services/edificios';
import Image from 'next/image';

interface Props {
  onBuildClick: (id: string, x: number, y: number, buildingType: string, ancho: number, largo: number, costo: number, cantidad: number, recursos: number) => void;

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
      let edificioSinAyunta = edificiosData.filter((edificio) => edificio.name !== 'ayuntamiento');
      setEdificios(edificioSinAyunta);
    } catch (error) {
      console.error("Error al obtener datos de edificios:", error);
    }
  };







  // Función para llamar a la función onBuildClick con el tipo de edificio seleccionado
  const handleBuildSelection = (buildingType: string) => {
    const selectedEdificio = edificios.find(edificio => edificio.name === buildingType);
    if (selectedEdificio) {
      // Aquí puedes definir las coordenadas x, y donde quieres construir el edificio
      const x = 200; // Por ejemplo, 100px desde el borde izquierdo del cuadro verde
      const y = 200; // Por ejemplo, 100px desde el borde superior del cuadro verde
      const ancho = selectedEdificio.ancho; // Usar ancho predeterminado si no está definido en la base de datos
      const largo = selectedEdificio.largo; // Usar largo predeterminado si no está definido en la base de datos
      const costo = selectedEdificio.costo; // Usar costo predeterminado si no está definido en la base de datos
      const cantidad = selectedEdificio.cantidad;
      const recurso = selectedEdificio.recurso;
      console.log(selectedEdificio.id, x, y, buildingType, ancho, largo, costo, cantidad, recurso)
      onBuildClick(selectedEdificio.id, x, y, buildingType, ancho, largo, costo, cantidad, recurso);
    } else {
      console.error(`No se encontró el edificio con el nombre "${buildingType}"`);
    }
  };

  const handleRecursos = (recurso: number) => {
    if (recurso == 1) {
      return 'Madera'
    }
    if (recurso == 2) {
      return 'Piedra'
    }
    return 'nada'
  }
  return (
    <>
      <div style={{ backgroundColor: 'rgb(172, 122, 27, 1)', border: '2mm ridge rgba(0, 0, 0, .7)' }} className=" flex absolute  justify-center items-center text-black font-stoothgart rounded">
        {/* Renderizar los botones para seleccionar el tipo de edificio */}
        {edificios.map((edificio, index) => (
          <div key={index} style={{
            border: '2mm ridge rgba(33, 35, 38, .8)', maxHeight: 200, maxWidth: 300
          }}

            className=' p-7 flex flex-col items-center max-h-100'>

            <button onClick={() => handleBuildSelection(edificio.name)}
              >
              <Image
                src={`/Images/edificios/${edificio.name}.png`}
                alt={edificio.name}
                height={100}
                width={100}
                style={{ paddingBottom: 40 }}
              />
            </button>
            <span className=' absolute top-0 text-lg text-black bottom-2 mt-2 flex-col max-w-100' > {edificio.name}</span>
            <span className=' absolute text-lg text-black bottom-2 mt-2 flex-col max-w-100' >Precio: {edificio.costo} de {handleRecursos(edificio.recurso)}</span>
          </div>

        ))}
      </div></>

  );
}

export default MenuDesplegable;