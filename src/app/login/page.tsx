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
    )
}

export default Login