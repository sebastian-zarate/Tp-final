'use server'
import { PrismaClient } from "@prisma/client"
/* import { NextResponse } from "next/server" */

const prisma = new PrismaClient()
//--------------------------------------------------
//////////////-----------------
// -----------------modifique esto ---------------
export const addEdificio = async (edificio: any, ancho: number, largo: number) => {
    const ed = await prisma.edificios.create({
        data: {
            ...edificio,
            ancho: ancho,
            largo: largo
        }
    });  
    return ed;
}
///--------------------------------------------
//------------------------------ esto modifique completo
//----------------------------------------------

export async function getEdificios(): Promise<any[]> {
    try {
        const edificios = await prisma.edificios.findMany({
            select: {
                id: true,
                name: true,
                ancho: true,
                largo: true,
                costo: true,
                cantidad: true,
                descripcion: true,     
            },
        });
        return edificios;
    } catch (error) {
        console.error("Error fetching edificios:", error);
        throw error;
    }
}



export const getEdificioById = async (Id: string) => {
    const edif = await prisma.edificios.findFirst({
        where:{
            id: Id
        }
    })
    return edif
}
export const getEdificioByName = async (Name: string) => {
    const edif = await prisma.edificios.findFirst({
        where:{
            name: Name
        }
    })
    return edif
}

// parece que no lo uso --seba
export const updateEdificioUltimaInteraccion = async (Id:any, UltimaInteraccion: any) => {
await prisma.edificios.update({
    where:{
        id:Id
    },
    data:{
        ultimaInteraccion: UltimaInteraccion
    }
})
}

export const deleteEdificios = async (Id:string) => {
    await prisma.edificios.delete({
        where:{
            id:Id
        }
    })    
    return true
}
export const getOneEdificio = async (Id:string) => {
    const e = await prisma.edificios.findUnique({
        where:{
            id:Id
        }
    })  
    return e
}

// devuelve la url de la imagen del edificio
export const getImagenEdificio= async (Id:string) => {
    const e = await prisma.edificios.findUnique({
        where:{
            id:Id
        }
    })  
    return e?.imagen
}

export async function updateUserBuildings(
    userId: string,
    nombreEdificio: string,
    newCantidad: number,
    piedras: number,
    maderas: number
  ) {

    console.log("userId: ", userId);
    console.log("newCantidad: ", newCantidad);
    console.log("nombreEdificio: ", nombreEdificio);

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
            [nombreEdificio]: newCantidad,
            piedra: piedras,
            madera: maderas
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

  // metodo para obtener los edificios de un usuario
  export async function getBuildingCount(idUser: string, idEdificio: string): Promise<any[]> {
    try {



        // Buscar todos los edificios creados por el usuario con el ID proporcionado
        const buildings = await prisma.userEdificios.findMany({
            where: {
                userId:idUser, // Utilizar el `userId` proporcionado en la llamada
                edificioId: idEdificio
            }
        });

        return buildings;
    } catch (error) {
        console.error("Error fetching buildings by user ID:", error);
        throw error;
    }}

