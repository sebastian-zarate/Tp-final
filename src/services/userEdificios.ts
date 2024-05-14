'use server'
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient({
    log: ['query']
})

// GET todos los edificios que construyó un usuario
export const getUserEdificios = async (Id: string) => {
    const e = await prisma.userEdificios.findMany({
        where: {
            userId: Id
        }
    })
    console.log(`User ${Id} Edificios: `, e)
}

// GET todos los edificios  del mismo tipo que construyó un usuario
export const getUserEdificiosIguales = async (userId: string, edificioId: string) => {
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

// GET un solo edificio que construyó un usuario
export const getOneUserEdificio = async (name: string) => {
    const e = await prisma.userEdificios.findFirst({
        where: {
            nivel: Number(name)
        }
    })
    console.log(`------>User Edificio ${name}: `, e)
    return e
}

// UPDATE un edificio que construyó un usuario
export const updateUserEdificio = async (Id: string, data: any) => {
    const e = await prisma.userEdificios.update({
        where: {
            id: Id
        },
        data: data
    })
    console.log(`User Edificio ${Id} updated: `, e)
    return e
}

// getById para ver si llega a la bdda
export const getUserEdificioById = async (Id: string) => {
    const e = await prisma.userEdificios.findUnique({
        where: {
            id: Id
            
        }
    })
    await console.log(`----->>>>>>>>>>>>> User Edificio ${Id}: `, e)
    return e
}
