
import { getEdificioById, getEdificioByName } from "@/services/edificios";
import {  getUEbyUserIdEdIdNico, getUEbyUserIdRet, updateUEunidades } from "@/services/userEdificios";
import { getUserByCooki } from "@/services/users";
import React, { useState } from "react";

/* interface Props {
    datos: (id: string, userId:string) => void
  } */

export default function MenuAsignar({datos, enviarDatosAlPadre, dato2}){
    const[disp, setDisp] = useState("none")

    let panXunidad = 10
    // Función para manejar la selección
    async function updateEdifUser(data: FormData) {

      console.log("IDDDD EDIF", datos)

    /*   let userEdif = await getUEbyUserIdEdIdNico(id_user, id_edif) */    
      let unidades = data.get('unidadesEdif') as string
      
      let id_EU = datos
      console.log("holaaaaaaaaaaaaaaaaaaaa", id_EU)
      if(id_EU && unidades) {
        console.log("acualizo doc------")
        try{
            await updateUEunidades(id_EU, parseInt(unidades), panXunidad)
        }catch(e){
            alert("error: "+ e)
        }
       
        }
        
    }
    const enviarDatos = () => {
        let estado = true
        console.log("datosssssssssssssssssssss ",estado)
        enviarDatosAlPadre(estado);
      };


    return( 
    <div id={datos} className=" flex-col" style={{display:"flex", marginLeft: "20px",transform: "rotateX(-32deg) rotateZ(50deg)  scale(1.15)"}}  >               
        <form  action={updateEdifUser} >                       
            <input className="text-black" type="number" name="unidadesEdif" placeholder="Trabajadores" />            
            <button type="submit" className=" text-black bg-yellow-500 hover:bg-yellow-700 " >Agregar</button>
            <button type="submit" className=" text-black bg-yellow-500 hover:bg-yellow-700 " onClick={enviarDatos}>Cerrar</button>
        </form>       
    </div>
      )
}
