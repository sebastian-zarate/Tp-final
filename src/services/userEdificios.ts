'use server'
import { PrismaClient } from "@prisma/client"
import { getUserById } from "./users"
import { getEdificioById } from "./edificios"
import { error } from "console"

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
        userId: '6642cd26b1865f8de5c7b62b',     //id nico
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


export async function builtEdificio(edificioID: string, edificioX: number,edificioY: number, edificioNivel: number) {
    try {
        // Obtener el ID del usuario
        const usuarioId = '6642cd26b1865f8de5c7b62b';   //id_nico
        console.log("usuarioId: ", edificioID)
        // Crear el edificio en la base de datos utilizando Prisma
        const nuevoEdificio = await prisma.userEdificios.create({
            data: {
                edificioId: edificioID, // Asegúrate de que este es un string válido
                posicion_x: edificioX,
                posicion_y: edificioY,
                userId: usuarioId,
                ultimaInteraccion: new Date(),
                nivel: edificioNivel // Establecer un valor por defecto para 'nivel'
            }
        });

        // Devolver el ID del usuario y el edificio creado
        return { usuarioId: usuarioId, edificio: nuevoEdificio };
    } catch (error) {
        console.error("Error al guardar el edificio en la base de datos:", error);
        throw error; // Relanzar el error para que sea manejado por el código que llama a esta función
    }
}




export async function getBuildingsByUserId(userId: string): Promise<any[]> {
    try {
        // Buscar todos los edificios creados por el usuario con el ID proporcionado
        const buildings = await prisma.userEdificios.findMany({
            where: {
                userId: '6642cd26b1865f8de5c7b62b', // Utilizar el `userId` proporcionado en la llamada
            },
            include: {
                edificio: {
                    select: {
                        id: true,
                        name: true,
                        ancho: true,
                        largo: true,
                        costo: true
                    }
                }
            }
        });

        // Mapeamos los resultados para que tengan el formato deseado
        return buildings.map(building => ({
             // Utilizar el id de la relación UserEdificios
            id: building.id,
            x: building.posicion_x,
            y: building.posicion_y,
            type: building.edificio.name, // Usar el nombre del edificio como tipo
            costo: building.edificio.costo,
            ancho: building.edificio.ancho,
            largo: building.edificio.largo,
            nivel: building.nivel

        }));
    } catch (error) {
        console.error("Error fetching buildings by user ID:", error);
        throw error;
    }
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

export const updateUEunidades= async (Id: string, unidades: any, panXunidad:any) => {

    //obtengo el doc userEdificio
    const ue = await prisma.userEdificios.findFirst({
        where:{
            id:Id
        }
    })
    //obtengo el id del user que se encuentra en el documento userEdificio
    const us_id = ue?.userId
    const usuario = await getUserById(us_id)
    //cantidad de unidades de trabajo que le quedan al user
    let resultadoUnidades = (usuario?.unidadesDeTrabajo) - unidades

    if(resultadoUnidades < 0) return error("Unidades insuficientes")

    let panUser = usuario?.pan - (panXunidad * unidades)

    if(panUser < 0) return error("Pan insuficiente para alimentar a las unidades")

    let unidadesEdif = unidades + (ue?.trabajadores)

    //actualizo el documento userEdificio
    const e = await prisma.userEdificios.update({
        where: {
            id: Id
        },
        data: {
           trabajadores: unidadesEdif
        }
    })
    //actualizo las unidades de trabajo restantes del usuario, y el pan restante del usuario
    await prisma.users.update({
        where:{
            id:usuario?.id
        },
        data: {
            unidadesDeTrabajo:resultadoUnidades,
            pan:panUser
        }
    })
    let edif = await getEdificioById(ue?.edificioId).then(x=>x)
    console.log("------------------Después de actualizar-------------------------------")
    console.log(`Edificio: ${edif?.name}- trabajadores: ${ue?.trabajadores} ` )
    console.log(`User: ${usuario?.id}- trabajadores: ${usuario?.unidadesDeTrabajo} ` )
    return e
}

