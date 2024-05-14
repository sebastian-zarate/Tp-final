import { authenticateUser } from "@/services/users"
import { redirect } from "next/navigation"

async function Login(){
    
    
    async function logUser(data:FormData) {
        'use server'
        const user = {
          email: data.get('email') as string,
          password: data.get('password') as string
        }
        await authenticateUser(user)        
        redirect('/principal')

/*         try{
            await authenticateUser(user)        
            redirect('/principal')
        }catch(e){
            redirect('/signup?error=true')
        } */


    }
    return(  
            <div className=" flex flex-col p-8 items-center justify-center bg-gray-400">
              
              <h1 className=" border-solid text-xl  text-white bg-gray-400">Login</h1>
              
              <form  action={logUser}>  
                <label htmlFor="email">Email</label>
                <p/>
                <input className="border px-2" type="email" id="email" name="email" required></input>
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