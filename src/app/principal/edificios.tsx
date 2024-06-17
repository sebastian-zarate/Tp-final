import React, { useState } from 'react';
import {  getBuildingCount } from '../../services/userEdificios';
import { getUserById, updateUserRecursosPropios } from '@/services/users';
import { Piedra } from 'next/font/google';





interface RecursosProps {
    userId: string;
    madera: number;
    setMadera: React.Dispatch<React.SetStateAction<number>>;
    piedra: number;
    setPiedra: React.Dispatch<React.SetStateAction<number>>;
    pan: number;
    setPan: React.Dispatch<React.SetStateAction<number>>;
  
    cargarUser: () => void;
}


const Edificios: React.FC<RecursosProps> = ({  userId ,madera, setMadera, piedra, setPiedra, pan, setPan, cargarUser}) => {
  
  const [message, setMessage] = useState<string | null>(null);
 



  const updateBuildingCount = async (userId: string, cantidad: number, costos: number, id: string): Promise<number> => {
    let countsMax = 0;

    try {
      const count = (await getBuildingCount(userId, id)).length;
      const user = await getUserById(userId);

      if (user) {
        let maderas = Number(madera);
        let piedras = Number(piedra);
        let pannes = Number(pan);

        if (costos <= madera && costos <= piedra && cantidad >= count) {
          countsMax = 1;
          maderas -= costos;
          piedras -= costos;
          // Actualizar recursos del usuario
          await updateUserRecursosPropios(userId,  maderas, piedras, pan);
          setMessage('Edificio construido exitosamente.');
        } else {
          if (madera < costos && piedra < costos) {
            setMessage('No tienes suficiente madera y piedra para construir.');
          } else if (madera < costos) {
            setMessage('No tienes suficiente madera para construir.');
          } else if (piedra < costos) {
            setMessage('No tienes suficiente piedra para construir.');
          } else if (cantidad <= count) {
            setMessage('Ya tienes el máximo de este edificio.');
          }
        }
      } else {
        setMessage('No se pudo obtener la información del usuario.');
      }
    } catch (error) {
      console.error('Error al actualizar el conteo de edificios:', error);
      setMessage('Error al actualizar el conteo de edificios.');
    }

    return countsMax;
  };

  return (
    <div>
      {message && <p>{message}</p>}
      {/* Resto del componente */}
    </div>
  );
};

export default Edificios;