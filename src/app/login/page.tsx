import { authenticateUser, getUserByemail } from "@/services/users"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

async function Login(){
    
    
    async function logUser(data:FormData) {
        'use server'
        const user = {
          /* username: data.get('username') as string, */
          dataUser: data.get('dataUser') as string,
          password: data.get('password') as string
        }
        const validaU = await authenticateUser(user)  

        if(validaU) redirect('/principal')
   


    }
    return(  
            <div className=" flex flex-col p-8 items-center justify-center bg-gray-400">
              
              <h1 className=" border-solid text-xl  text-white bg-gray-400">Login</h1>
              
              <form  action={logUser}>  
                <label htmlFor="dataUser">Email o Username</label>
                <p/>
                <input className="border px-2" type="text" id="dataUser" name="dataUser" required></input>
                <p/>
                <label htmlFor="password">Password</label>
                <p/>
                <input className="border px-2" type="password" id="password" name="password" required></input>
                <p/>        
            
                <button className=" ml-12 mt-5 bg-red-600 text-white px-2 py-1" type="submit">Iniciar Sesión</button>          
              </form>     
      
               <a href="/signup" className=" mt-5 text-sm text-white">Tiene una cuenta creada?</a>   
                    
              
      
            </div>
    )
/*
USOS DE ALGUNOS COMANDOS:

-max-w-xs: limita el ancho maximo del formulario para que no sea demasiado grande en pantallas de mayor tamaño

-mb-4: margin-bottom a cada input y boton para dar espacio entre ellos 

-w-full: Asegura que todos los botones y inputs ocupen todo el espacio disponible del contenedor del formulario


*/



}

export default Login