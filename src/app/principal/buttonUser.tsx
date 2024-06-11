
import { updateUEunidadesAdd, updateUEunidadesSubstract } from "@/services/userEdificios";
import { getUserByCooki } from "@/services/users";
import { useState } from "react";
import Mensajeria from "./menuChats";


export default function ButtonUser({userId,mostrarMensajeria, userLoaded, chats,chatnames, handleMensajeria, getMensajes}:
    {userId:any,  mostrarMensajeria:any, userLoaded:any, chats:any, chatnames:any, handleMensajeria:any, getMensajes:any}){

    const [estado, setEstado] = useState<boolean>(false)
    const [unidadesTot, setUnidadesTot] = useState<number>(0)




    return( 
    <div className="flex flex-col  items-center text-blue font-bold  rounded" style={{height:"50vh"}}>  
        <div>
        <h1>foto</h1>
        <h2>Username</h2>
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
        <button className=" absolute bottom-6" onClick={()=> window.location.replace("/login")} >Cerrar Sesión</button>

    </div>
      )
}