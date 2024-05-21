/* "use client" */
import { verifyJWT } from "@/helpers/jwt";
import { getEdificioById, getEdificioByName } from "@/services/edificios";
import { getUEbyUserIdEdId, getUEbyUserIdEdIdNico, getUEbyUserIdRet, updateUE, updateUEunidades } from "@/services/userEdificios";
import {  getUserByHash, getUserById } from "@/services/users"
/* import Cookies from 'universal-cookie' */
import { redirect } from "next/navigation" 
import { cookies } from "next/headers";
import { time } from "console";
import { DocumentProps } from "postcss";
/* import { useState } from "react"; */


export default async function Unidades(){



    const cooki = cookies().get('user')?.value
    console.log("cokieessssssssssssssssss",cooki)
    if(!cooki) redirect("/login")
    let valor = cooki
    let user;
    if (valor) {
        let hash = verifyJWT(valor)
        user = await getUserByHash(hash)

    }
    if(!valor && user){
     redirect('/login')
    }
    user = await getUserById(user?.id)
    const list = await getUEbyUserIdRet(user?.id)


     function espera(esp: any) {
        esp.style.display == "flex"
        setTimeout(() => {
            esp.style.display == "none"
        }, 15000)
    } 
    // Función para manejar la selección
    async function updateEdifUser(data: FormData) {
        "use server"
      let id_edif = await getEdificioByName(data.get('edificios') as string).then(x => x?.id)
      let userEdif = await getUEbyUserIdEdIdNico(user?.id, id_edif)
    
      let unidades = data.get('unidadesEdif')
      let id_EU = userEdif?.id
      if (typeof document !== 'undefined') {
        // Tu código que utiliza document aquí
        const esp = document.getElementById('color-espera');
        esp.display = 'none';
        esp.style.display == "flex"
        espera(esp)
        console.log("espera-----")
      }

      if(id_EU) {
        console.log("acualizo doc------")
        await updateUEunidades(id_EU, parseInt(unidades))
        }
        
    }

    async function getEdifs(){
    /*     const list = await getUEbyUserIdRet("66468410bdff2445e9bb57d6")  */
       
        console.log("edificios++++++++++++++++++++++", list[0])

        let arr = []
        //en un bucle por cada elemento de la lista pusheo en un nuevo array el nombre de los edificios pertenecientes al user
        for (let index = 0; index < list.length; index++) {
            arr.push(await getEdificioById(list[index].edificioId).then(x => x?.name))            
        }
        return arr
    } 

    return( 

        <div className=" mt-16 p-8  bg-gray-400">
            
            <div className=" bg-white w-8/12 flex flex-col  p-5 border m-5">
                <h1 className="flex justify-center p-2 text-lg">Inventario de {user?.username}</h1>
                <span>Aldeanos libres: {user?.username}</span>
                <span> * madera disponible: {user?.madera}</span>
                <span> * piedra disponible: {user?.piedra}</span>
                <span> * pan disponible: {user?.pan}</span>
            </div>

            <div className=" bg-white p-10 m-5 w-8/12 flex-col flex justify-between">
               
                <form className=" flex  flex-col" action={updateEdifUser}>     
                    <label htmlFor="edificios">Elige un edificio:</label>              
                    <select name="edificios" id="ed">
                       { ((await getEdifs()).map((x) => (
                             <option value={x} >{x}</option>
                        )))} 
                       
                    </select>                   
                    <input type="number" name="unidadesEdif" placeholder="Nº-trabajadores del edificio" />
                    <span id="color-espera" className=" hidden text-xs text-red-600">Se esta guardando el cambio</span>
                    <button type="submit" className=" mt-5 bg-blue-500 hover:bg-blue-700 " >Agregar</button>
                   {/*  <button  className=" mt-5 bg-blue-500 hover:bg-blue-700 ">Cancelar</button>                    */}
                </form>
                <a href="/principal" className="flex justify-center mt-5 bg-blue-400 hover:bg-blue-700 ">Principal</a>
            </div>
  
        </div>
      )
}
