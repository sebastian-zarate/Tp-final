
import { updateUEunidadesAdd, updateUEunidadesSubstract } from "@/services/userEdificios";
import { getUserByCooki } from "@/services/users";
import { useState } from "react";


export default function MenuAsignar({idUE, cerrarCompuerta, estadoCompuerta}: {idUE: any,cerrarCompuerta:any, estadoCompuerta:any}){

    let panXunidad = 10
    const [estado, setEstado] = useState<boolean>(false)
    const [unidadesTot, setUnidadesTot] = useState<number>(0)


    // Función para manejar la admisión o substracción de unidades de un edificio  
    async function formulario(event: any){
        event.preventDefault();
        // get form data
        const data = new FormData(event.target);
        const unidades = Number(data.get('unidadesEdif'))
        
        if(unidades < 0){       //comparo que no se puedan asignar unidades negativas
            event.target.reset();
            return alert("No se admiten unidades negativas")
        }
        //obtener unidades totales del usuario
        const unid = getUserByCooki().then(result =>result?.unidadesDeTrabajo)
        setUnidadesTot(Number(unid))

        if(unidades >unidadesTot ){        //comparo que no se puedan asignar unidades por encima de las que ya tiene el usuario
            event.target.reset();
            return alert("unidades exedidas")
            

        }
        //añadir unidades al edificio
        if(estado ) updateEdifUserAdd(unidades)
        //restar unidades al edificio
        if(!estado) updateEdifUserSubtract(unidades)
        
        event.target.reset();
        cerrarCompuerta(!estadoCompuerta)
    }
    //método para añadir unidades al edificio
    async function updateEdifUserAdd(unidades:any) {      
        // si existe el id del userEdificio y las unidades seleccionadas
      if(idUE && unidades) {
          console.log("acualizo doc------")
          try{
              await updateUEunidadesAdd(idUE, unidades, panXunidad)     //método que actualiza unidades al edificio y al usuario
          }catch(e){
              alert("error: "+ e)
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
          }catch(e){
              alert("error: "+ e)
          }       
        }
    }

    return( 
    <div id={idUE} className=" flex-col" style={{display:"flex", marginLeft: "20px",transform: "rotateX(-32deg) rotateZ(50deg)  scale(1.15)"}}  >               
        <form  onSubmit={formulario} >                       
            <input className="text-black" type="number" name="unidadesEdif" placeholder="Trabajadores" />            
            <button type="submit" className=" text-black bg-yellow-500 hover:bg-yellow-700 " onClick={()=>setEstado(true)} >Agregar</button>
            <button type="submit" className=" text-black bg-yellow-500 hover:bg-yellow-700 " onClick={()=>setEstado(false)}>Quitar</button>
        </form>       
        <button type="button" className=" text-black bg-yellow-500 hover:bg-yellow-700 " onClick={() => cerrarCompuerta(!estadoCompuerta)}>Salir</button>
    </div>
      )
}
