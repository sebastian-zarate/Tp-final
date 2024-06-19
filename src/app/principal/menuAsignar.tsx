
import { updateUEunidadesAdd, updateUEunidadesSubstract } from "@/services/userEdificios";
import { getUserByCooki } from "@/services/users";
import { useState } from "react";


export default function MenuAsignar({idUE, cerrarCompuerta, setError, setBoxError, setPan, setUnidadesDisp, unidadesTrabajando}:{
    idUE: any,
    cerrarCompuerta:any,
    setError:any,
    setBoxError:any,
    setPan:any,
    setUnidadesDisp:any,
    unidadesTrabajando:any}){

    let panXunidad = 10
    const [estado, setEstado] = useState<boolean>(false)



    // Función para manejar la admisión o substracción de unidades de un edificio  
    async function formulario(event: any){
        event.preventDefault();
        // get form data
        const data = new FormData(event.target);
        const unidades = Number(data.get('unidadesEdif'))
        
        //añadir unidades al edificio
        if(estado ) updateEdifUserAdd(unidades)
        //restar unidades al edificio
        if(!estado) updateEdifUserSubtract(unidades)
        
        event.target.reset();
        cerrarCompuerta(false)
    }
    //método para añadir unidades al edificio
    async function updateEdifUserAdd(unidades:any) {      
        // si existe el id del userEdificio y las unidades seleccionadas
      if(idUE && unidades) {
          console.log("acualizo doc------")
          try{
              await updateUEunidadesAdd(idUE, unidades, panXunidad)     //método que actualiza unidades al edificio y al usuario
              setPan((prev:any)=> prev -  (unidades * panXunidad))
              setUnidadesDisp((prev:any)=> prev - unidades)
          }catch(e){
            setError(String(e))
            setBoxError(true)
          }       
        }
    }
    //método para quitar unidades al edificio
    async function updateEdifUserSubtract(unidades:any) {      
      // si existe el id del userEdificio y las unidades seleccionadas   
      if(idUE && unidades) {
          console.log("acualizo doc------")
          try{
              await updateUEunidadesSubstract(idUE, Number(unidades), panXunidad) //método que actualiza unidades al edificio y al usuario
              setPan((prev:any)=> prev + (unidades * panXunidad))
              setUnidadesDisp((prev:any)=> prev + unidades)
          }catch(e){
            setError(String(e))
            setBoxError(true)
          }       
        }
    }

    return( 
        <div id={idUE} className=" flex-col" style={{display:"flex", marginLeft: "20px", position: "relative",zIndex:"4"}}>               
        <form  onSubmit={formulario} >                       
            <input className="text-black" type="number" name="unidadesEdif" placeholder="Trabajadores" />            
            <button type="submit" className=" text-black bg-yellow-500 hover:bg-yellow-700 " onClick={()=>setEstado(true)} >Agregar</button>
            <button type="submit" className=" text-black bg-yellow-500 hover:bg-yellow-700 " onClick={()=>setEstado(false)}>Quitar</button>
        </form>     
        <button type="button" className=" text-black bg-yellow-500 hover:bg-yellow-700 " onClick={() => cerrarCompuerta(false)}>Salir</button>
    </div>
      )
}
