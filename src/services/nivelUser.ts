'use server '
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const getNivelUser = async (Id: string) => {
    const e = await prisma.nivelEdificio.findFirst({
        where: {
            userId: Id
        },
        select: {
            nivel: true,
            ayuntamiento: true,
            canon: true,
            muros: true,
            maderera: true,
            panaderia: true,
            cantera: true,
            herreria: true,
            bosque: true
        }
    });
    console.log(`User ${Id} Nivel: `, e);
    return e;
}
export const updateNivelUser = async (Id: string, newData: any) => {
    try {
        const updatedData = await prisma.nivelEdificio.updateMany({
            where: {
                userId: Id
            },
            data:{
                nivel: newData.nivel,
                ayuntamiento: newData.ayuntamiento,
                canon: newData.canon,
                muros: newData.muros,
                maderera: newData.maderera,
                panaderia: newData.panaderia,
                cantera:    newData.cantera,
                herreria:   newData.herreria,
                bosque:    newData.bosque
            }
        });
        console.log(`User ${Id} updated data: `, updatedData);
        return updatedData;
    } catch (error) {
        console.error(`Error updating data for user ${Id}: `, error);
        throw error;
    }
}


export const createNivelUser = async (userId: string, newData: any) => {
    try {
        const newUserNivel = await prisma.nivelEdificio.create({
            data: {
                // Asignar el ID del usuario a la relación
                userId: userId,
                // Resto de los datos necesarios para crear el nivel del usuario
                nivel: newData.nivel,
                ayuntamiento: newData.ayuntamiento,
                canon: newData.canon,
                muros: newData.muros,
                maderera: newData.maderera,
                panaderia: newData.panaderia,
                cantera: newData.cantera,
                herreria: newData.herreria,
                bosque: newData.bosque
            }
        });

        console.log(`New user nivel created: `, newUserNivel);
        
        return newUserNivel;

       
    } catch (error) {
        console.error(`Error creating new user nivel and edificios: `, error);
        throw error;
    }
}

