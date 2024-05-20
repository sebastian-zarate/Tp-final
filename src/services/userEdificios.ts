'use server'
import { PrismaClient } from "@prisma/client";



const prisma = new PrismaClient();


    



export async function GuardarEdificio(id: string, posX: number, posY: number): Promise<void> {
    //id = '663ac05f044ccf6167cf703d'

    console.log("id ", id)
    console.log(" posx", posX)
    console.log(posY)
    try {
      // Lógica para guardar/actualizar el edificio en la base de datos
      await prisma.userEdificios.update({
        where: { id },
        data: {
        userId: '6645239328fab0b97120439e',
          posicion_x: posX,
          posicion_y: posY,
         
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


export async function builtEdificio(edificioId: string,posX: number, posY: number ): Promise<void> {
    try {
        // Lógica para crear un nuevo edificio en la base de datos
        await prisma.userEdificios.create({
            data: {
                userId: '6645239328fab0b97120439e',
                posicion_x: posX,
                posicion_y: posY,
                edificio: {
                    connect: { id: edificioId } // Conectar el edificio existente por su ID
                }
            },
        });
        console.log("Edificio creado exitosamente.");
    } catch (error) {
        console.error("Error al guardar el edificio:", error);
        throw error;
    }
}







export async function getBuildingsByUserId(userId: string): Promise<any[]> {
    try {
        // Buscar todos los edificios creados por el usuario con el ID proporcionado
        const buildings = await prisma.userEdificios.findMany({
            where: {
                userId: '6645239328fab0b97120439e', // Utilizar el `userId` proporcionado en la llamada
            },
            include: {
                edificio: {
                    select: {
                        id: true,
                        ancho: true,
                        largo: true,
                        name: true, // Suponiendo que 'name' es el tipo del edificio
                    }
                }
            }
        });

        // Mapeamos los resultados para que tengan el formato deseado
        return buildings.map(building => ({
            id: building.edificio.id,
            x: building.posicion_x,
            y: building.posicion_y,
            type: building.edificio.name, // Usar el nombre del edificio como tipo
            ancho: building.edificio.ancho,
            largo: building.edificio.largo
        }));
    } catch (error) {
        console.error("Error fetching buildings by user ID:", error);
        throw error;
    }
}

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

// GET un solo edificio que construyó un usuario (No tiene un uso claro)
/*
export const getUe = async (name: string) => {
    const e = await prisma.userEdificios.findFirst({
        where: {
            nivel: Number(name)
        }
    })
    console.log(`------>User Edificio ${name}: `, e)
    return e
}
*/

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
