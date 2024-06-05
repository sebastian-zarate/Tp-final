

import { updateUEunidades } from "@/services/userEdificios";

//export default function MenuAsignar({datos, enviarDatosAlPadre}){
export default function MenuAsignar({datos, enviarDatosAlPadre}: {datos: any, enviarDatosAlPadre: any}){

    let panXunidad = 10
    function espera(esp: any) {
      esp.style.display == "flex"
      setTimeout(() => {
          esp.style.display == "none"
      }, 15000)
    } 

    // Función para manejar la selección
    async function updateEdifUser(data: FormData) {
      console.log("IDDDD EDIFUSER", datos)

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
