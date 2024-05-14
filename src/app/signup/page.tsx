import { createUser } from "@/services/users"
import { redirect } from 'next/navigation'


async function Signup(){

    async function createUs(data:FormData) {
        "use server"
        const email =data.get('email') as string
        const password =data.get('password') as string
        const user = {
          email: email,
          password: password
        }
        await createUser(user)
        redirect('/login')        
      
      }
     


    return(   
        <div className=" flex flex-col mt-16 p-8 items-center justify-center bg-gray-400">
          
          <h1 className=" border-solid text-xl  text-white bg-gray-400">Signup</h1>
          <form  action={createUs}>  
            <label id='emailLabel' htmlFor="email">Email</label>
            <p/>
            <input className="border px-2" type="email" id="email" name="email" required></input>
            <p/>
            <label htmlFor="password">Password</label>
            <p/>
            <input className="border px-2" type="password" id="password" name="password" required></input>
            <p/>
            
            <button className=" ml-12 mt-5 bg-blue-600 text-white px-2 py-1" type="submit">Registrarse</button>
          </form>   
          <a href="/login" className=" m-5 text-sm text-white">Ya tengo mi cuenta creada</a>   
          <div className=" p-3 text-sm border flex flex-col">
            <span  id="em_caract">El email es mayor a 5 caracteres?</span>
            <span id="em_simb">Es email incluye el simbolo "@"?</span>
            <span id="cont_caract">La contraseña es mayor a 8 caracteres?</span>
            
          </div>     
  
        </div>
      )
}
export default Signup