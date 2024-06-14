
import { updateUEunidadesAdd, updateUEunidadesSubstract } from "@/services/userEdificios";
import { getUserByCooki, removeCookie } from "@/services/users";
import { useState } from "react";
import Mensajeria from "./menuChats";


export default function ButtonUser({userId,mostrarMensajeria, userLoaded, chats,chatnames, handleMensajeria, getMensajes}:
    {userId:any,  mostrarMensajeria:any, userLoaded:any, chats:any, chatnames:any, handleMensajeria:any, getMensajes:any}){


    async function deleteCook() {
        await removeCookie();
    }
    return( 
    <div className="px-8 py-6 my-2 items-center absolute top-6 right-0    flex flex-col bg-blue-500   font-bold  rounded" style={{height:"83vh"}}>  
        <div>
        <h1 className="top-4 text-white ">foto</h1>
        <h2 className="flex top-8 text-white ">Username</h2>
        </div>    
        {<Mensajeria 
              userId= {userId}
              mostrarMensajeria={mostrarMensajeria}
              userLoaded={userLoaded}
              chats={chats}
              chatnames={chatnames}
              handleMensajeria={handleMensajeria}
              getMensajes={getMensajes}/>
        }         
        <button className="text-white  absolute bottom-6" onClick={()=> {window.location.replace("/login"); deleteCook()}} >Cerrar Sesión</button>

    </div>
      )
}