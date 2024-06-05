
<<<<<<< HEAD
=======
import { getEdificioById, getEdificioByName } from "@/services/edificios";
import {  getUEbyUserIdEdIdNico, getUEbyUserIdRet, updateUEunidades } from "@/services/userEdificios";
import { getUser } from "@/services/users";
import React from "react";
>>>>>>> 42a04d10d3ee9c48b4e24b31ae3302a15d12e0be

import { updateUEunidades } from "@/services/userEdificios";

export default function MenuAsignar({datos, enviarDatosAlPadre}){

    let panXunidad = 10
    function espera(esp: any) {
      esp.style.display == "flex"
      setTimeout(() => {
          esp.style.display == "none"
      }, 15000)
    } 

    // Función para manejar la selección
    async function updateEdifUser(data: FormData) {
<<<<<<< HEAD
      console.log("IDDDD EDIFUSER", datos)
=======
       /*  "use server" */
       // LO AGREGUE PARA QUE DEJE DE TIRAR ERROR ESTO
        let user = await getUser("6642cd26b1865f8de5c7b62b")
      let id_edif = await getEdificioByName(data.get('edificios') as string)
      let userEdif = await getUEbyUserIdEdIdNico(String(user?.id || ""), String(id_edif?.id || ""))
    
      let unidades = data.get('unidadesEdif') as string
      let id_EU = userEdif?.id
>>>>>>> 42a04d10d3ee9c48b4e24b31ae3302a15d12e0be

      let unidades = data.get('unidadesEdif') as string
      let id_EU = datos

      console.log("IDDD EU", id_EU)
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
        console.log("dato enviado al padre ",estado)
        enviarDatosAlPadre(estado);
      };


    return( 
    <div id={datos} className=" flex-col" style={{display:"flex", marginLeft: "20px",transform: "rotateX(-32deg) rotateZ(50deg)  scale(1.15)"}}  >               
        <form  action={updateEdifUser} >                       
            <input className="text-black" type="number" name="unidadesEdif" placeholder="Trabajadores" />            
            <button type="submit" className=" text-black bg-yellow-500 hover:bg-yellow-700 " >Agregar</button>
            <button type="button" className=" text-black bg-yellow-500 hover:bg-yellow-700 " onClick={enviarDatos}>Cerrar</button>
        </form>       
    </div>
      )
}
