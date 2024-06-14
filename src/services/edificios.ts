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
                // otros campos que necesites
                
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

