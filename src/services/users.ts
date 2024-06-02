'use server'
import { PrismaClient } from "@prisma/client"

import { getSalt, hashPassword } from "../helpers/hashPassword";
import { cookies } from "next/headers";
import { signJWT } from "@/helpers/jwt";

const prisma = new PrismaClient()
let cantMadera = 500
let cantPan = 800
let cantPiedra= 600
let unidadesDeTrabajo = 100
let cantCantera = 0
let cantMaderera = 0
let cantPanaderia = 0
let cantAyuntamiento = 0
let cantCanon = 0
let cantMuro = 0
let cantBosque = 0
let cantHerreria = 0

export async function createUser(user: { email: string, password: string, username: string}) {
  if (!user.email || user.email.length < 5 || !user.email.includes('@') ) {
    throw new Error('Invalid email');
  }
  if (!user.username || user.username.length < 3){
    throw new Error('Invalid username');
  }
  const existing = await prisma.users.findFirst({
    where: {
      email: user.email
    }
  })
  if (existing) {
    throw new Error('User already exists');
  }
  const existingUsername = await prisma.users.findFirst({
    where: {
      username: user.username
      }
  })
  if (existingUsername) {
    throw new Error('Username already exists');
  }

  if (!user.password || user.password.length < 8) {
    throw new Error('Password too short');
  }

  const salt = getSalt();

  const  userWithHash = {
    username: user.username,
    email: user.email,
    hash: hashPassword(salt + user.password),
    
    piedra: cantPiedra,
    pan: cantPan,
    madera: cantMadera,
    nivel:1, 
    salt,
    unidadesDeTrabajo,
    canon : 0,
    muro : 0,
    bosque : 0,
    herreria : 0,
    cantera : 0,
    maderera :0,
    panaderia : 0,
    ayuntamiento : 0,

}

  await prisma.nivelEdificio.create({ data: userWithHash });
}

export async function authenticateUser(user: {username:string, email: string, password: string }) {

  const existing = await prisma.users.findFirst({
    where: {
      email: user.email
    }
  })
  if (!existing) {
    throw new Error('User not found');
  }
  const hash = hashPassword(existing.salt + user.password);
  console.log("el hash nuevo: ", hash)
  console.log("el hash existente: ", existing.hash)
  if (hash !== existing.hash) {
    throw new Error('Invalid password');
  }
  
  cookies().set("user" , signJWT(hash) , { httpOnly: true, sameSite: 'strict' })
  cookies().set("userName" , user.username , { httpOnly: true, sameSite: 'strict' })
  /* cookies().set("userName" , user.email , { httpOnly: true, sameSite: 'strict' }) */
/*   if(user.email){
    cookies().set(user.email, signJWT(hash) , { httpOnly: true, sameSite: 'strict' })
  } 
  if(user.username){
    cookies().set(user.username, signJWT(hash) , { httpOnly: true, sameSite: 'strict' })
  }
 */
 

  return { email: existing.email, username: existing.username };
}


export const getUserByUserName = async (userName:string) => {
  const users = await prisma.users.findFirst({
    where: {
      username: userName
    }
  })        
  return users
}
export const getUserByemail = async (email:string) => {
  const users = await prisma.users.findFirst({
    where: {
      email: email
    }
  })   
   return users
}
//método que me devuelve un booleano de si existe el usuario
export const getBoolUserExist = async (email:string) => {
  const users = await prisma.users.findFirst({
    where: {
      email: email
    }
  })  
  if(users)  return true
  else return false    
}

export const updateUnidAtaqUser =async (id:string, data: any) => {
  const users = await prisma.users.update({
    where: {
      id: id
    },
    data: {
      unidadesDeAtaque: data
    }
  })
  return users
}
export const updateUnidDefUser =async (id:string, data: any) => {
  const users = await prisma.users.update({
    where: {
      id: id
    },
    data: {
      unidadesDeDefensa: data
    }
  })
  return users
}

export async function getUser(Id: string) {
  const u = await prisma.users.findUnique({
    where: {
      id: Id
    }
  })
  console.log(`User ${Id}: `, u)
  return u
}

export async function updateUser(Id: string, data: any) {
  const u = await prisma.users.update({
    where: {
      id: Id
    },
    data: data
  })
  console.log(`User ${Id} updated: `, u)
  return u
}
//---------------------------------------------------------------
//----------------------
export async function updateUserBuildings(
  userId: string,
  canon: number,
  muro: number,
  bosque: number,
  herreria: number,
  cantera: number,
  maderera: number,
  panaderia: number,
  ayuntamientos: number,
) {
  try {
    // Buscar al usuario
    const user = await prisma.users.findUnique({
      where: {
        id: userId,
      },
    });

    if (user) {
      // Actualizar los campos de edificios con las cantidades proporcionadas
      await prisma.users.update({
        where: {
          id: userId,
        },
        data: {
          canon: canon,
          muros: muro,
          bosque: bosque,
          herreria: herreria,
          cantera: cantera,
          maderera: maderera,
          panaderia: panaderia,
          ayuntamiento: ayuntamientos,
        },
      });
      console.log('User buildings updated successfully.');
    } else {
      console.log(`User with ID ${userId} not found.`);
    }
  } catch (error) {
    console.error('Error updating user buildings:', error);
    throw error;
  }
};

const getUserBuildings = async (userId: string) => {
  try {
    // Buscar al usuario
    const user = await prisma.users.findUnique({
      where: {
        id: userId,
      },
      select: {
        canon: true,
        muros: true,
        bosque: true,
        herreria: true,
        cantera: true,
        maderera: true,
        panaderia: true,
        ayuntamiento: true
      },
    });

    if (user) {
      // Devolver un objeto con las cantidades de cada tipo de edificio
      return {
        canon: user.canon,
        muro: user.muros,
        bosque: user.bosque,
        herreria: user.herreria,
        cantera: user.cantera,
        maderera: user.maderera,
        panaderia: user.panaderia,
        ayuntamiento: user.ayuntamiento,
      };
    } else {
      console.log(`User with ID ${userId} not found.`);
      return null;
    }
  } catch (error) {
    console.error('Error fetching user buildings:', error);
    throw error;
  }
};






//------------------------------------------------------
//--------------------------------------------
/*
export async function ObtenerEdificiosCreados(userId: string) {


  try {
    // Obtiene solo el campo "muro" para el usuario especificado
    const edificio = await prisma.users.findUnique({
      where: {
        id: userId,
      },
      select: {
        ayuntamiento: true,
        maderera: true,
        panaderia: true,
        cantera: true,
        canon: true,
        muro: true,
        bosque: true,
        herreria: true,
      },
    });
    return edificio;
  } catch (error) {
    console.error("Error obteniendo el edificio:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function modificarEdificiosCreados(userId: string, nuevoValorAyuntamiento: number, nuevoValorMaderera: number, nuevoValorPanaderia: number, nuevoValorCantera: number, nuevoValorCanon: number, nuevoValorMuro: number, nuevoValorBosque: number, nuevoValorHerreria: number) {
  try {
    const edificio = await prisma.users.update({
      where: {
        id: userId,
      },
      data: {
        ayuntamiento: nuevoValorAyuntamiento, // Reemplaza "nuevoValorAyuntamiento" con el nuevo valor que deseas establecer
        maderera: nuevoValorMaderera, // Reemplaza "nuevoValorMaderera" con el nuevo valor que deseas establecer
        panaderia: nuevoValorPanaderia, // Reemplaza "nuevoValorPanaderia" con el nuevo valor que deseas establecer
        cantera: nuevoValorCantera, // Reemplaza "nuevoValorCantera" con el nuevo valor que deseas establecer
        canon: nuevoValorCanon, // Reemplaza "nuevoValorCanon" con el nuevo valor que deseas establecer
        muro: nuevoValorMuro, // Reemplaza "nuevoValorMuro" con el nuevo valor que deseas establecer
        bosque: nuevoValorBosque, // Reemplaza "nuevoValorBosque" con el nuevo valor que deseas establecer
        herreria: nuevoValorHerreria, // Reemplaza "nuevoValorHerreria" con el nuevo valor que deseas establecer
      },
    });
    return edificio;
  } catch (error) {
    console.error("Error modificando los edificios:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
*/