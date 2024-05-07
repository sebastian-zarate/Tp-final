import { useState } from 'react';
import { PrismaClient } from '@prisma/client';
//import {datos} from '../../lib/prisma';
//const prisma = new PrismaClient();

const DinamicEdificios = () => {
  const [buttons, setButtons] = useState([]);
  const [draggedButtonIndex, setDraggedButtonIndex] = useState(null);
  const buttonSize = 100; // Tamaño del botón en píxeles

  //const nombresEdificios = datos; // Ajusta esta lista con los nombres de tus edificios
 const nombresEdificios = ['Muros', 'Herrería', 'Cantera', 'Maderera','Ayuntamiento', 'Granja', 'Cuartel', 'Taller', 'Mercado', 'Embajada']
  const handleButtonClick = (event) => {
    if (buttons.length >= 10) return; // Limita la creación de botones a 10

    const x = event.clientX;
    const y = event.clientY;

    const edificioName = nombresEdificios[buttons.length % nombresEdificios.length]; // Ciclo entre los nombres de edificios disponibles

    setButtons([...buttons, { x, y, edificioName }]);
  };

  const handleMouseDown = (event, index) => {
    setDraggedButtonIndex(index);
  };

  const handleMouseUp = () => {
    setDraggedButtonIndex(null);
  };

  const handleMouseMove = (event) => {
    if (draggedButtonIndex !== null) {
      const newButtons = [...buttons];
      newButtons[draggedButtonIndex].x = event.clientX;
      newButtons[draggedButtonIndex].y = event.clientY;
      setButtons(newButtons);
    }
  };

  return (
    <div
      className="relative flex justify-center items-center h-screen bg-green-500"
      onClick={handleButtonClick}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {buttons.map((button, index) => (
        <div
          key={index}
          className="absolute"
          style={{
            left: `${button.x}px`,
            top: `${button.y}px`,
            transform: 'rotateX(45deg) rotateZ(-45deg)',
            transformOrigin: 'center center'
          }}
          onMouseDown={(event) => handleMouseDown(event, index)}
        >
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            {button.edificioName}
          </button>
        </div>
      ))}
    </div>
  );
};

export default DinamicEdificios;
