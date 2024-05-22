import { authenticateUser, getUserByemail } from "@/services/users"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

async function Login(){
    
    
    async function logUser(data:FormData) {
        'use server'
        const user = {
          /* username: data.get('username') as string, */
          email: data.get('email') as string,
          password: data.get('password') as string
        }
        const cooki = cookies().get('user')?.value
        if(!cooki) await authenticateUser(user)  
        else{ redirect('/principal')}


    }
<<<<<<< HEAD
    return(  
            <div className=" flex flex-col p-8 items-center justify-center bg-gray-400">
              
              <h1 className=" border-solid text-xl  text-white bg-gray-400">Login</h1>
              
              <form  action={logUser}>  
                <label htmlFor="email">Email o Username</label>
                <p/>
                <input className="border px-2" type="text" id="email" name="email" required></input>
                <p/>
                <label htmlFor="password">Password</label>
                <p/>
                <input className="border px-2" type="password" id="password" name="password" required></input>
                <p/>        
            
                <button className=" ml-12 mt-5 bg-red-600 text-white px-2 py-1" type="submit">Iniciar Sesión</button>          
              </form>     
      
               <a href="/signup" className=" mt-5 text-sm text-white">Tiene una cuenta creada?</a>   
                    
              
      
            </div>
=======
    return (
      <div className="flex flex-col p-8 items-center justify-top bg-gray-400">
        <h1 className="border-solid text-xl text-white mb-4">Login</h1>
        <form className="flex flex-col items-center w-full max-w-xs" action={logUser}>
          <label htmlFor="username" className="self-start">Username</label>
          <input className="border px-2 mb-4 w-full" type="text" id="username" name="username" required />
  
          <label htmlFor="email" className="self-start">Email</label>
          <input className="border px-2 mb-4 w-full" type="email" id="email" name="email" required />
  
          <label htmlFor="password" className="self-start">Password</label>
          <input className="border px-2 mb-4 w-full" type="password" id="password" name="password" required />
  
          <button className="bg-red-600 text-white px-4 py-2 w-full" type="submit">Iniciar Sesión</button>
        </form>
        <a href="/signup" className="mt-4 text-sm text-white">¿Tiene una cuenta creada?</a>
      </div>
>>>>>>> 83b138d2272cfbb2b538c0992b1f3d1b83fcd4f2
    )
/*
USOS DE ALGUNOS COMANDOS:

-max-w-xs: limita el ancho maximo del formulario para que no sea demasiado grande en pantallas de mayor tamaño

-mb-4: margin-bottom a cada input y boton para dar espacio entre ellos 

-w-full: Asegura que todos los botones y inputs ocupen todo el espacio disponible del contenedor del formulario


*/



}

export default Login