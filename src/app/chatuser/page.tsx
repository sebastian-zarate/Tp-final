
import { getChat } from "@/services/chats";
import { getEdificioById, getEdificioByName } from "@/services/edificios";
import { createMensaje, getMensajes } from "@/services/mensajes";
import {  getUEbyUserIdEdIdNico, getUEbyUserIdRet, updateUEunidades } from "@/services/userEdificios";
import {  getUserByCooki, getUserByHash, getUserById, updateUserRecursos } from "@/services/users"
import Document from "next/document";
import { redirect } from "next/navigation" 




export default async function ChatUser(){

    const user = await getUserByCooki()
    if(!user){
     redirect('/login')
    }

    //ordena los mensajes por tiempo 
    const list = await getMensajes("665f29b8beb8232d2baed9e9") //charla matute koro
    list.sort((mensaje1, mensaje2) => (mensaje1.fecha.getTime()) - (mensaje2.fecha.getTime())) 
   

    //averiguar quien es el emisor
    let emisor = await getChat("665f29b8beb8232d2baed9e9").then(resul => resul?.username2)
    let usernameMine = String(user.username)
    if(emisor == usernameMine) emisor = await getChat("665f29b8beb8232d2baed9e9").then(resul => resul?.username1)
       
/* _id
665f29b8beb8232d2baed9e9
user1
66468410bdff2445e9bb57d6
user2
6642cd26b1865f8de5c7b62b
username1
"matute"
username2
"korosensee" 

_id  665f433188959d36f26b33c7
chatId  665f29b8beb8232d2baed9e9
emisor  66468410bdff2445e9bb57d6
madera 0
piedra 0
pan 30
texto "Que tal un pal de lol?"
fecha 2024-06-03T03:00:00.000+00:0
*/  
  

    async function crearM(data: FormData) {
        "use server"
        const mensaje= {
            chatId: "665f29b8beb8232d2baed9e9",   
            emisor: String(user?.id),   //soy yo
            emisorUserName: String(user?.username),
            madera: Number(data.get("madera")),
            pan: Number(data.get("pan")),
            piedra: Number(data.get("piedra")),
            texto: data.get("mensaje") as string,
            fecha: new Date()
            }
        //se crea el mensaje
        const m = await createMensaje(mensaje)
        console.log("El mensaje creado: ",m)

        const userUpdat = updateUserRecursos(String(user?.id) ,mensaje.madera, mensaje.piedra, mensaje.pan)        
        console.log("Usuario actualizado: ",userUpdat)
    }
    return( 

        <main>
           <div className=" flex flex-col justify-center items-center mt-16 p-8  bg-gray-400">            
               <div className=" justify-between bg-white w-8/12 flex   p-5 border m-5">
                   <h1>Chat: {emisor}</h1>
               </div>

               <div className=" bg-white p-10 m-2 w-8/12 flex-col flex justify-between">
                    <div className="p-5 flex flex-col font-bold text-sm bg-slate-300">
                        {list.map((mensaje, index) => ( 
                            <div className=" m-2" >
                                <span key={index} className=" text-slate-500 text-xs"> - {mensaje.emisorUserName} - {mensaje.fecha.toLocaleDateString()} -{mensaje.fecha.toLocaleTimeString()}</span>               
                                <div  className=" w-2/6 border p-3 rounded-sm border-white">
                                <span key={index}>{mensaje.texto}</span>
                                </div>    
                                
                            </div>
                            
                        ))}
                    </div>
               
                    <form className=" flex pt-5 flex-col" action={crearM} >     
                        <label htmlFor="mensaje">Mensaje</label>    
                        <textarea className=" h-20 w-full resize-none" name="mensaje" placeholder="Límite de caractéres: 300"></textarea>          
                            
                       <h3 className="flex justify-center items-center">Desea donar algún recurso?</h3>
                       <div className=" border">
                            <div>
                                <label htmlFor="madera">Madera:</label>
                                <input id="madera" type="number" name="madera"/>
                            </div>
                            <div>
                                <label htmlFor="piedra">Piedra</label>
                                <input id="piedra" type="number" name="piedra"/>
                            </div>
                            <div>
                                <label htmlFor="pan">Pan</label>
                                <input id="pan" type="number" name="pan"/>
                            </div>
                       </div>
                           
                        <button type="submit" className=" mt-5 bg-blue-500 hover:bg-blue-700 " >Enviar</button>
                        {/*  <button  className=" mt-5 bg-blue-500 hover:bg-blue-700 ">Cancelar</button>                    */}
                    </form>           
                   <a href="/principal" className="flex justify-center mt-5 bg-blue-400 hover:bg-blue-700 ">Principal</a>
               </div>  
           </div>
       </main>
      )
}
