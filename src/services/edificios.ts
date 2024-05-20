'use server'
import { PrismaClient } from "@prisma/client"
/* import { NextResponse } from "next/server" */
import { ObjectId } from "mongodb";
const prisma = new PrismaClient()

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

// services/edificios.ts
export async function getEdificios(): Promise<any[]> {
    try {
        const edificios = await prisma.edificios.findMany({
            select: {
                id: true,
                name: true,
                ancho: true,
                largo: true,
                // otros campos que necesites
            },
        });
        return edificios;
    } catch (error) {
        console.error("Error fetching edificios:", error);
        throw error;
    }
}

//        -----------------------------------------------
export const updateEdificioUltimaInteraccion = async (
    Id: any,
    UltimaInteraccion: any,
    ancho?: number,
    largo?: number,
    costo?: number,
    descripcion?: string
  ) => {
    await prisma.edificios.update({
      where: {
        id: Id
      },
      data: {
        ultimaInteraccion: UltimaInteraccion,
        ancho: ancho,
        largo: largo,
        costo: costo,
        descripcion: descripcion
      }
    });
  };
  


export const deleteEdificios = async (Id:string) => {
    await prisma.edificios.delete({

        where:{
            id:Id
        }
    })    
     console.log('El edificio ha sido eliminado exitosamente.');
    return true
};
export const getOneEdificio = async (Id: string) => {
    try {
        if (!ObjectId.isValid(Id)) {
            throw new Error("Invalid Id. It must be a valid ObjectID.");
        }

        const e = await prisma.edificios.findUnique({
            where: {
                id: Id
            }
        });
        return e;
    } catch (error) {
        console.error("Error retrieving edificio:", error);
        throw new Error("Error retrieving edificio");
    }
};



/* export const getRecursos = async () => {
    const muchos = await prisma.recursos.findMany()  
    console.log(muchos)        
    return muchos
}
export const addRecurso = async (recurso:any) => {
    const ed = await prisma.recursos.create({
        data: recurso
    })  
    return ed
}
export const deleteRecur = async (Id:string) => {
    await prisma.recursos.delete({
        where:{
            id:Id
        }
    })    
    return true
}
 */


  /* async function crearE() {

    //aca se crean las colecciones para la base de datos
     const torretas = await prisma.edificios.create({
        data:{
            name: 'Cañon',
            nivel: 0
        },
    })
    const ayunta = await prisma.edificios.create({
        data:{
            name: 'Ayuntamiento',
            nivel: 0
        }
    })
    const muros = await prisma.edificios.create({
        data:{
            name: 'Muros',
            nivel: 0
        }
    })
    const herreria = await prisma.edificios.create({
        data:{
            name: 'Herrería',
            nivel: 0
        }
    })
    const cantera = await prisma.edificios.create({
        data:{
            name: 'Cantera',
            nivel: 0
        }
    })
    const maderera = await prisma.edificios.create({
        data:{
            name: 'Maderera',
            nivel: 0
        }
    })
    const bosque = await prisma.edificios.create({
        data:{
            name: 'Bosque',
            nivel: 0
        }
    })
    const arr = [torretas, ayunta,muros, herreria, cantera, maderera, bosque] 
    return arr
}

export default crearE()    */