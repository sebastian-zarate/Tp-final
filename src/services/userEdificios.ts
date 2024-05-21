'use server'
import { PrismaClient } from "@prisma/client"
import { getEdificioById } from "./edificios"

const prisma = new PrismaClient()

// GET todos los edificios que construyó un usuario (sin importar el EdificioId)
export const getUEbyUserId = async (Id: string) => {
    const e = await prisma.userEdificios.findMany({
        where: {
            userId: Id
        }
    })
    console.log(`User ${Id} Edificios: `, e)
    return e
}

// GET todos los edificios  del mismo EdificioId que construyó un usuario
export const getUEbyUserIdEdId = async (userId: string, edificioId: string) => {
    const e = await prisma.userEdificios.findMany({
        where: {
            userId: {
                equals: userId,
            },
            edificioId: {
                equals: edificioId,
            }
        }
    })
    console.log(`UserID ${userId} EdificiosID ${edificioId}: `, e)
    return e
}

export async function GuardarEdificio(id: string, posX: number, posY: number, edificioNivel: number): Promise<void> {
    //id = '663ac05f044ccf6167cf703d'

    console.log("id ", id)
    console.log(" posx", posX)
    console.log(posY)
    try {
      // Lógica para guardar/actualizar el edificio en la base de datos
      await prisma.userEdificios.updateMany({
        where: { id },
        data: {
        userId: '6645239328fab0b97120439e',
          posicion_x: posX,
          posicion_y: posY,
          nivel : edificioNivel

        },

      });
    } catch (error) {
      console.error("Error saving building:", error);
      throw error;
    }
    console.log("id ", id)
    console.log(" posx", posX)
    console.log(posY)

  }

// UPDATE un edificio que construyó un usuario
export const updateUE= async (Id: string, data: any) => {
    const e = await prisma.userEdificios.update({
        where: {
            id: Id
        },
        data: data
    })
    console.log(`User Edificio ${Id} updated: `, e)
    return e
}

//GET por el id principal de la tabla UserEdificios
export const getUEById = async (Id: string) => {
    const e = await prisma.userEdificios.findUnique({
        where: {
            id: Id

        }
    })
    await console.log(`----->>>>>>>>>>>>> User Edificio ${Id}: `, e)
    return e
}
//misma funcionalidad que el de matu, pero aca retorna el documento
export const getUEbyUserIdRet = async (Id: string) => {
    const e = await prisma.userEdificios.findMany({
        where: {
            userId: Id
        }
    })
    return e
}

// GET todos los edificios  del mismo EdificioId que construyó un usuario
export const getUEbyUserIdEdIdNico = async (userId: string, edificioId: string) => {
    const e = await prisma.userEdificios.findFirst({
        where: {
            userId: {
                equals: userId,
            },
            edificioId: {
                equals: edificioId,
            }
        }
    })
    console.log(`UserID ${userId} EdificiosID ${edificioId}: `, e)
    return e
}

export const updateUEunidades= async (Id: string, data: any) => {
    const e = await prisma.userEdificios.update({
        where: {
            id: Id
        },
        data: {
           trabajadores: data
        }
    })
    console.log(`User Edificio ${Id} updated: `, e)
    return e
}