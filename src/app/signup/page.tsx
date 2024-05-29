import { createUser } from "@/services/users"
import { redirect } from 'next/navigation'

async function Signup() {

    async function createUs(data:FormData) {
        "use server"
        const email =data.get('email') as string
        const password =data.get('password') as string
        const username =data.get('username') as string
        const profileImage = data.get('profileImage') as File 
        const user = {
          email: email,
          password: password,
          username: username,
          profileImage: profileImage.toString()
        }
        await createUser(user)
        redirect('/login')        
      
      }
     

      return (
        <div className="flex flex-col mt-16 p-8 items-center justify-top bg-gray-400">
          <h1 className="border-solid text-xl text-white mb-4">Signup</h1>    
          <form className="flex flex-col items-center" action={createUs}>
            <label htmlFor="username" className="self-start">Username</label>
            <input className="border px-2 mb-4 w-full" type="text" id="username" name="username" required />
    
            <label htmlFor="email" className="self-start">Email</label>
            <input className="border px-2 mb-4 w-full" type="email" id="email" name="email" required />
    
            <label htmlFor="password" className="self-start">Password</label>
            <input className="border px-2 mb-4 w-full" type="password" id="password" name="password" required />
    
            <label htmlFor="profileImage" className="self-start">Profile Image</label>
            <input type="file" id="profileImage" name="profileImage" accept="image/*" className="mb-4 w-full" />
    
            <button className="bg-blue-600 text-white px-4 py-2 w-full" type="submit">Registrarse</button>
          </form>
          <a href="/login" className="mt-4 text-sm text-white">Ya tengo mi cuenta creada</a>
          <div className="p-3 text-sm border flex flex-col mt-4">
            <span id="em_caract">El email es mayor a 5 caracteres?</span>
            <span id="em_simb">¿El email incluye el símbolo "@"?</span>
            <span id="cont_caract">¿La contraseña es mayor a 8 caracteres?</span>
            <span id="use_caract">¿El username es mayor a 3 caracteres?</span>
          </div>
        </div>
      )
    }
    export default Signup
    
    /*
    USOS DE ALGUNOS COMANDOS:
    -mb-4: margin-bottom a cada input y boton para dar espacio entre ellos 
    -flex flex-col items-center: Alineacion vertical de los elementos del formulario y centrados horizontalmente 
    -w-full: Asegura que todos los botones y inputs ocupen todo el espacio disponible del contenedor del formulario    */

