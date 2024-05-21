
import { getEdificioById } from "@/services/edificios"
import { getUEbyUserIdRet } from "@/services/userEdificios"
import { PrismaClient } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"
/* import crearE from "@/services/edificios" */

const prisma = new PrismaClient()

/* export const GET = async () => {
    const allUsers = await prisma.torretas.findMany()
    console.log(allUsers)
    return NextResponse.json("HOLA "+ allUsers)
} */

export const GET = async () => {
/*     const muchos = await prisma.users.findFirst()  

    return NextResponse.json(muchos) */
    
    try{
        const e = await getUEbyUserIdRet("66468410bdff2445e9bb57d6")
            console.log("arrr-_______",e)
 /*        if(typeof arr == "string"){
            for(let i = 0; i> arr.length; i++){e
                console.log("arrr-_______", arr[i])
            }
        } */
        return  NextResponse.json( e)
    } catch(e){
        return "EL error: " + e
    }

}
