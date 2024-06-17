'use server'
import { PrismaClient } from "@prisma/client"
import { getUserByCooki, getUserById } from "./users"
import { getEdificioById } from "./edificios"
import { edifSinUnid, panIns, unidExed, unidIns, unidNegat } from "@/helpers/error"

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


///////////////////////////////
//////////////////////////////////////////
//--------------------------------------------

export async function GuardarEdificio(usersId: string,id: string, posX: number, posY: number, edificioNivel: number): Promise<void> {


    // modifica la posicion de un edificio
     try {
       // Lógica para guardar/actualizar el edificio en la base de datos
       await prisma.userEdificios.updateMany({
         where: { id },
         data: {
         userId: usersId,     //id nico
           posicion_x: posX,
           posicion_y: posY,
           nivel : edificioNivel
          
         },
        
       });
     } catch (error) {
       console.error("Error saving building:", error);
       throw error;
     }
  
 
   }
 
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export async function builtEdificio( usuarioId: string, edificioID: string, edificioX: number,edificioY: number, edificioNivel: number) {
    try {
        // Obtener el ID del usuario
       
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




export async function getBuildingsByUserId(usuarioId: string): Promise<any[]> {
    console.log("usuarioId",usuarioId)
     let user = usuarioId
    try {

        // Buscar todos los edificios creados por el usuario con el ID proporcionado
        const buildings = await prisma.userEdificios.findMany({
            where: {
                userId: user, // Utilizar el `userId` proporcionado en la llamada
            },
            include: {
                edificio: {
                    select: {
                        id: true,
                        name: true,
                        ancho: true,
                        largo: true,
                        costo: true,
                        //---------------------------
                        // ---------agrege ---------
                        cantidad: true,
                        

                        //---------------------------
                    }
                }
            }
        });
///------------------------------------------------------------------------------------------------------------------------
///-----------------------------lo cambile-------------------------------------------------------------------------------------------
 
        // Mapeamos los resultados para que tengan el formato deseado
         // Filtramos los resultados que tienen un edificio válido
         const validBuildings = buildings.filter(building => building.edificio !== null);

         // Mapeamos los resultados para que tengan el formato deseado
         return validBuildings.map(building => ({
             // Utilizar el id de la relación UserEdificios
             id: building.id,
             x: building.posicion_x,
             y: building.posicion_y,
             type: building.edificio.name, // Usar el nombre del edificio como tipo
             costo: building.edificio.costo,
             ancho: building.edificio.ancho,
             largo: building.edificio.largo,
             nivel: building.nivel,
             cantidad: building.edificio.cantidad,
             edificioId: building.edificioId// para la imagen
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
export const getUEbyUserIdEdIdNico = async (UserId: string, EdificioId: string) => {
    const ue = await prisma.userEdificios.findFirst({
        where: {
            userId: {
                equals: UserId,
            },
            edificioId: {
                equals: EdificioId,
            }
        }
    })

    console.log(`User ${await getUserById(UserId).then(X=>X?.username)} EdificiosID ${EdificioId} `, ue?.id)
    return ue
}
//region cambie esto (Nico)
//método para agregar unidades de un edificio
export const getEdificionameByUE = async (Id:string) => {
    const ue = await prisma.userEdificios.findFirst({
        where:{
            id:Id
        }
    })
    const edificio = await getEdificioById(String(ue?.edificioId))
    const edificioName = edificio?.name
    return edificioName;
}
export const updateUEunidadesAdd = async (Id: string, unidades: any, panXunidad: any) => {
            
    if(unidades < 0){       //comparo que no se puedan asignar unidades negativas
        throw new Error(unidNegat)
    }
    //obtener unidades totales del usuario
    const unid = await getUserByCooki()
    

    if(unidades >Number(unid?.unidadesDeTrabajo) ){        //comparo que no se puedan asignar unidades por encima de las que ya tiene el usuario        
        throw new Error(unidExed)       
    }
    //obtengo el doc userEdificio
    const ue = await prisma.userEdificios.findFirst({
        where: {
            id: Id
        }
    })
    //obtengo el id del user que se encuentra en el documento userEdificio
    const us_id = ue?.userId
    const usuario = await getUserById(String(us_id))
    //cantidad de unidades de trabajo que le quedan al user
    let resultadoUnidades = (Number(usuario?.unidadesDeTrabajo)) - unidades

    if (resultadoUnidades < 0) throw Error(unidIns)

    let panUser = Number(usuario?.pan) - (panXunidad * unidades)

    if (panUser < 0) throw Error(panIns)

    let unidadesEdif = Number(ue?.trabajadores) + unidades 
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
        where: {
            id: usuario?.id
        },
        data: {
            unidadesDeTrabajo: resultadoUnidades,
            pan: panUser
        }
    })
    let edif = await getEdificioById(String(ue?.edificioId)).then(x => x)
    console.log("------------------Después de actualizar-------------------------------")
    console.log(`Edificio: ${edif?.name}- trabajadores: ${ue?.trabajadores} `)
    console.log(`User: ${usuario?.id}- trabajadores: ${usuario?.unidadesDeTrabajo} `)
    return e
}
//método para restar unidades de un edificio
export const updateUEunidadesSubstract = async(Id: string, unidades: any, panXunidad: any) => {
    if(unidades < 0){       //comparo que no se puedan asignar unidades negativas
        throw new Error(unidNegat)
    }
    //obtengo el doc userEdificio
    const ue = await prisma.userEdificios.findFirst({
        where: {
            id: Id
        }
    })
    if(Number(ue?.trabajadores) <= 0)throw new Error(edifSinUnid)
    //obtengo el id del user que se encuentra en el documento userEdificio
    const us_id = ue?.userId
    const usuario = await getUserById(String(us_id))
    //cantidad de unidades de trabajo que le quedan al user
    let resultadoUnidades = (Number(usuario?.unidadesDeTrabajo)) + unidades
    //cantidad de pan que le quedan al user
    let panUser = Number(usuario?.pan) + (panXunidad * unidades)
   
    let unidadesEdif = Number(ue?.trabajadores) -  unidades
    if (unidadesEdif < 0) throw Error(edifSinUnid)

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
        where: {
            id: us_id
        },
        data: {
            unidadesDeTrabajo: resultadoUnidades,
            pan: panUser
        }
    })
    let edif = await getEdificioById(String(ue?.edificioId)).then(x => x)
    console.log("------------------Después de actualizar-------------------------------")
    console.log(`Edificio: ${edif?.name}- trabajadores: ${ue?.trabajadores} `)
    console.log(`User: ${usuario?.id}- trabajadores: ${usuario?.unidadesDeTrabajo} `)
    return e
}


// metodo para obtener los edificios de un usuario

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
    }
};
  // agrege los metodo  getBuildingCount() y  updateUserBuildings(
