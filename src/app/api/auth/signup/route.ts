
import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"
/* import crearE from "@/services/edificios" */

const prisma = new PrismaClient()

/* export const GET = async () => {
    const allUsers = await prisma.torretas.findMany()
    console.log(allUsers)
    return NextResponse.json("HOLA "+ allUsers)
} */

export const GET = async () => {
    const muchos = await prisma.edificios.findMany()  
    console.log(muchos)
/*     console.log(crearE) */
    return NextResponse.json(muchos)
}
