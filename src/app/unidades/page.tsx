/* "use client" */
import { getBoolUserExist, getUserByemail, getUserByUserName } from "@/services/users"
import { cookies } from "next/headers"
import { redirect } from "next/navigation" 
/* import { useEffect, useState } from "react" */
/* import Cookies from 'js-cookie' */
/* import { useNavigate } from "react-router-dom" */



export default  async function Unidades(){
    const valorUserName = cookies().get('userName')?.value
    const estado =  getBoolUserExist(valorUserName)
/*     const[boton, setboton] =useState(0) */
/*     useEffect(() => {
        let cancelled = false
        if(!cancelled){
        const valorUserName = Cookies.get('userName')?.value
        console.log(valorUserName)
        }
        return () => {
          cancelled = true
        }
      }, []) */
  if(!estado){
    redirect('/login')
   }

    async function infoUser() {        
       return await getUserByemail(valorUserName)
    } 

    /* function getCostoUnidades(){
        let costo = infoUser().then(x => x?.nivel)
        costo *= 
    } */
    function getCostoTotal(){

    }

    return( 

        <div className=" mt-16 p-8  bg-gray-400">
            
            <div className=" bg-white w-70 flex flex-col  p-5 border m-5">
                <h1 className="flex justify-center p-2 text-lg">Inventario de {infoUser().then(x => x?.username)}</h1>
                <span>Aldeanos libres: {infoUser().then(x => x?.unidadesDisponibles)}</span>
                <span> * madera disponible: {infoUser().then(x => x?.madera)}</span>
                <span> * piedra disponible: {infoUser().then(x => x?.piedra)}</span>
                <span> * pan disponible: {infoUser().then(x => x?.pan)}</span>
                <span> _ Unidades de ataque: {infoUser().then(x => x?.unidadesDeAtaque)}</span>
                <span> _ Unidades de defensa: {infoUser().then(x => x?.unidadesDeDefensa)}</span>
                <span> _ Unidades de recolección: {infoUser().then(x => x?.unidadesDeRecoleccion)}</span>
            </div>

            <div className=" bg-white p-10 border m-5 flex justify-between">
                <div className=" flex flex-col border border-cyan-950 p-3">
                    <button>Defensa</button>
                    <label >Costo por unidad: 5 panes</label>
                    <input id="totalDefensa" type="number"  placeholder="Elija el número de unidades" />
                    <label  >Costo total: {getCostoTotal()}</label>
                    <button className=" mt-5 bg-blue-500 hover:bg-blue-700 ">Agregar</button>
                    <button className=" mt-5 bg-blue-500 hover:bg-blue-700 ">Cancelar</button>
                   
                </div>
                <div className="flex flex-col border border-cyan-950 p-3">
                    <button>Ataque</button>
                    <label >Costo por unidad: 5 panes</label>
                    <input id="totalAtaque" type="number"  placeholder="Elija el número de unidades" />
                    <label >Costo total:</label>
                    <button className=" mt-5 bg-blue-500 hover:bg-blue-700 ">Agregar</button>                   
                    <button className=" mt-5 bg-blue-500 hover:bg-blue-700 ">Cancelar</button>
                </div>
                <div className="flex flex-col border border-cyan-950 p-3">
                    <button>Recolección</button>
                    <label >Costo por unidad: 5 panes</label>
                    <input id="totalRecoleccion" type="number"  placeholder="Elija el número de unidades" />
                    <label >Costo total:</label>
                    <button className=" mt-5 bg-blue-500 hover:bg-blue-700 ">Agregar</button>
                    <button className=" mt-5 bg-blue-500 hover:bg-blue-700 ">Cancelar</button>
                   
                </div>
            </div>
  
        </div>
      )
}
