'use server'
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// GET todos los mensajes de un chat
export const getMensajes = async (Id: string) => {
    const m = await prisma.mensajes.findMany({
        where: {
            chatId: Id
        }
    })
    console.log(`Chat ${Id} Mensajes: `, m)
    return m
}

// GET un solo mensaje de un chat
export const getMensaje = async (Id: string) => {
    const m = await prisma.mensajes.findFirst({
        where: {
            id: Id
        }
    })
    console.log(`Mensaje ${Id}: `, m)
    return m
}
// crear Mensaje
export const createMensaje = async (data: any) => {
    const m = await prisma.mensajes.create({
        data: data
    })
    return m
}
// devuelve el numero de mensajes no leidos de un chat
export const getMensajesNoLeidos = async (chatId: string, emisor: string) => {
    const count = await prisma.mensajes.count({
        where: {
            chatId: chatId,
            //para que no sea mi propio mensaje
            emisor: {
                not: emisor
            },
            leido: false
        }
    })
    return count
}

export const updateMensaje = async (Id: string, data: any) => {
    const m = await prisma.mensajes.update({
        where: {
            id: Id
        },
        data: data
    })
    return m
}