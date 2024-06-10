// src/services/buildingService.ts

import { updateUserBuildings, GuardarEdificio } from '../../services/users';
import { BuildingPosition, BuildingDetails, Resources, Setters, User } from '@/app/principal/dynamicButton';








const updateBuildingCount = async (
  id: string,
  costos: number,
  resources: Resources,
  setters: Setters,
  user: User
) => {
  let countsMax = 0;

  const newCounts = { ...resources };

  switch (id) {
    case '663ac05f044ccf6167cf7041':
      if (resources.maderera < 3 && resources.madera >= costos) {
        newCounts.maderera++;
        newCounts.madera -= costos;
        setters.setMaderera(newCounts.maderera);
        setters.setMadera(newCounts.madera);
        countsMax = 1;
      } else {
        if (resources.maderera >= 3) {
          user.setMessage('Debes tener ayuntamiento en nivel 5 para poder construir más madereras');
        }
        if (resources.madera < costos) {
          user.setMessage('No tienes suficiente madera para construir.');
        }
      }
      break;
    case '663ac05f044ccf6167cf7040':
      if (resources.cantera < 3 && resources.madera >= costos) {
        newCounts.cantera++;
        newCounts.madera -= costos;
        setters.setCantera(newCounts.cantera);
        setters.setMadera(newCounts.madera);
        countsMax = 1;
      } else {
        if (resources.cantera >= 3) {
          user.setMessage('Debes tener ayuntamiento en nivel 5 para poder construir más canteras');
        }
        if (resources.madera < costos) {
          user.setMessage('No tienes suficiente madera para construir.');
        }
      }
      break;
    case '663ac518044ccf6167cf7054':
      if (resources.panaderia < 4 && resources.pan >= costos) {
        newCounts.panaderia++;
        newCounts.pan -= costos;
        setters.setPanaderia(newCounts.panaderia);
        setters.setPan(newCounts.pan);
        countsMax = 1;
      } else {
        if (resources.panaderia >= 3) {
          user.setMessage('Debes tener ayuntamiento en nivel 5 para poder construir más panaderias');
        }
        if (resources.pan < costos) {
          user.setMessage('No tienes suficiente pan para construir.');
        }
      }
      break;
    case '663ac060044ccf6167cf7042':
      if (resources.bosque < 3 && resources.madera >= costos) {
        newCounts.bosque++;
        newCounts.madera -= costos;
        setters.setBosque(newCounts.bosque);
        setters.setMadera(newCounts.madera);
        countsMax = 1;
      } else {
        if (resources.bosque >= 3) {
          user.setMessage('Debes tener ayuntamiento en nivel 5 para poder construir más bosque');
        }
        if (resources.madera < costos) {
          user.setMessage('No tienes suficiente madera para construir.');
        }
      }
      break;
    case '663ac05f044ccf6167cf703e':
      if (resources.muros < 12 && resources.piedra >= costos) {
        newCounts.muros++;
        newCounts.piedra -= costos;
        setters.setMuros(newCounts.muros);
        setters.setPiedra(newCounts.piedra);
        countsMax = 1;
      } else {
        if (resources.muros >= 3) {
          user.setMessage('Debes tener ayuntamiento en nivel 5 para poder construir más muros');
        }
        if (resources.madera < costos) {
          user.setMessage('No tienes suficiente piedra para construir.');
        }
      }
      break;
    case '663ac05f044ccf6167cf703d':
      if (resources.ayuntamiento < 1 && resources.madera >= costos) {
        newCounts.ayuntamiento++;
        newCounts.madera -= costos;
        setters.setAyuntamiento(newCounts.ayuntamiento);
        setters.setMadera(newCounts.madera);
        countsMax = 1;
      } else {
        if (resources.ayuntamiento >= 1) {
          user.setMessage('Ya tienes un ayuntamiento');
        }
        if (resources.madera < costos) {
          user.setMessage('No tienes suficiente madera para construir.');
        }
      }
      break;
    case '663ac05f044ccf6167cf703f':
      if (resources.herreria < 2 && resources.piedra >= costos) {
        newCounts.herreria++;
        newCounts.piedra -= costos;
        setters.setHerreria(newCounts.herreria);
        setters.setPiedra(newCounts.piedra);
        countsMax = 1;
      } else {
        if (resources.herreria >= 2) {
          user.setMessage('Debes tener ayuntamiento en nivel 5 para poder construir más herrerias');
        }
        if (resources.madera < costos) {
          user.setMessage('No tienes suficiente piedra para construir.');
        }
      }
      break;
    default:
      console.log('ID de edificio no reconocido');
      break;
  }

  try {
    await updateUserBuildings(
      user.userId.toLowerCase(),
      newCounts.muros,
      newCounts.bosque,
      newCounts.herreria,
      newCounts.cantera,
      newCounts.maderera,
      newCounts.panaderia,
      newCounts.ayuntamiento,
      newCounts.pan,
      newCounts.madera,
      newCounts.piedra
    );
    console.log('User buildings count updated successfully.');
  } catch (error) {
    console.error('Error updating user buildings count:', error);
  }

  return countsMax;
};
