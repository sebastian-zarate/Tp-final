
import { getEdificioById, getEdificioByName } from "@/services/edificios";
import {  getUEbyUserIdEdIdNico, getUEbyUserIdRet, updateUEunidades } from "@/services/userEdificios";
import React from "react";

export default function menuAsignar(){

    let panXunidad = 10
    // Función para manejar la selección
    async function updateEdifUser(data: FormData) {
        "use server"
      let id_edif = await getEdificioByName(data.get('edificios') as string)
      let userEdif = await getUEbyUserIdEdIdNico(user?.id, id_edif?.id)
    
      let unidades = data.get('unidadesEdif') as string
      let id_EU = userEdif?.id

      if(id_EU && unidades) {
        console.log("acualizo doc------")
        try{
            await updateUEunidades(id_EU, parseInt(unidades), panXunidad)
        }catch(e){
            alert("error: "+ e)
        }
       
        }
        
    }


    return( 
    <div className=" bg-white p-10 m-5 w-8/12 flex-col flex justify-between">               
        <form className=" flex  flex-col" action={updateEdifUser}>                       
            <input type="number" name="unidadesEdif" placeholder="Nº-trabajadores del edificio" />
            <span id="color-espera" className=" hidden text-xs text-red-600">Se esta guardando el cambio</span>
            <button type="submit" className=" mt-5 bg-blue-500 hover:bg-blue-700 " >Agregar</button>
           {/*  <button  className=" mt-5 bg-blue-500 hover:bg-blue-700 ">Cancelar</button>                    */}
        </form>
        <a href="/principal" className="flex justify-center mt-5 bg-blue-400 hover:bg-blue-700 ">Principal</a>
    </div>
      )
}
