import { NextResponse } from "next/server"
import Torretas from "@/models/edificios"
import {connectDb} from "@/lib/database"

export async function POST(request: Request){
    await connectDb()
    const {id/* name, id, nivelEdif */} = await request.json()

    /* console.log(`${name},${id}, ${nivelEdif}`) */
   /*  const torretasFound = await Torretas.findOne({ id}) */

   try{
    const torretasFound = await Torretas.findOne({id})
    return NextResponse.json("torret encontrada: ",torretasFound )
   } catch(e){
    return NextResponse.json({message:`error: ${e}`})
   }
    

/*     if(!torretasFound){
        return NextResponse.json({
            message: "Torreta no  existe"
        }, {
            status:400
        })
    } */

/*     const torret = new Torretas({
        id,
        nivelEdif,
        name
    })
    const saveTorreta = await torret.save()
    console.log(saveTorreta) */
    
}