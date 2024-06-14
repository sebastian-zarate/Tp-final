import { authenticateUser, getUserByemail } from "@/services/users"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import backgroundImage from '../../../public/Images/Papyre.png';
import imageLogin from '../../../public/Images/InputLogin.jpg';
import containerImage from '../../../public/Images/Container.png';
import VikingoShield from '../../../public/Images/VikingoShieldAxeSinFondo.png'
import VikingoSword from '../../../public/Images/VikingoSwordSombreado.png'
import Image from "next/image";

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
      <div 
        style={{
          backgroundImage: `url(${backgroundImage.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: 0,
          padding: 0,
          //position: 'relative',
        }}
      >
        <div 
          className="flex flex-col items-center bg-contain"
          style={{
            backgroundImage: `url(${containerImage.src})`,
            backgroundSize: '100% 100%', // Asegura que la imagen cubra todo el contenedor
            backgroundPosition: 'center',
            //borderRadius: '1rem',
            width: '400px', // ajusta el ancho del contenedor según sea necesario
            padding: '100px',
            boxSizing: 'border-box',
            position: 'relative',
            marginTop: '2rem'
          }}
        >
          <h1 className="border-solid mb-4 text-4xl font-stoothgart text-yellow-400">Login</h1>
          
          <form className="w-full" action={logUser}>  
            <label className="dataUser text-lg font-stoothgart text-yellow-400">Email o Username</label>
            <input className="border px-2 mb-4 w-full rounded text-white" style={{ backgroundColor: 'rgba(172, 122, 27, 1)' }} type="text" id="dataUser" name="dataUser" required />
            
            <label className="password text-lg font-stoothgart text-yellow-400">Password</label>
            <input className="border px-2 mb-4 w-full rounded text-white" style={{ backgroundColor: 'rgba(172, 122, 27, 1)' }} type="password" id="password" name="password" required />        
            
            <button 
              type="submit"
              style={{
                background: 'none',
                border: 'none',
                padding: 5,
                cursor: 'pointer'
              }}
            >
              <Image src={imageLogin} alt="Iniciar Sesión" />
            </button>         
          </form>     
      
          <a href="/signup" className="mt-5 text-lg font-stoothgart text-yellow-400">¿Tiene una cuenta creada?</a>   
        </div>
        <Image 
          src={VikingoShield} 
          alt="Vikingo Decorativo" 
          style={{ 
            position: 'absolute', 
            bottom: '30%', // Ajusta la posición vertical según sea necesario
            right: '80px', // Ajusta la posición horizontal según sea necesario
            //zIndex: 9999, // Asegura que la imagen esté por encima de otros elementos
            width: '25%', // Ajusta el tamaño según sea necesario
            height: '45%' 
          }} 
        />

        <Image 
          src={VikingoSword} 
          alt="Vikingo Decorativo" 
          style={{ 
            position: 'absolute', 
            bottom: '30%', // Ajusta la posición vertical según sea necesario
            left: '80px', // Ajusta la posición horizontal según sea necesario
            //zIndex: 9999, // Asegura que la imagen esté por encima de otros elementos
            width: '25%', // Ajusta el tamaño según sea necesario
            height: '45%' 
          }} 
        />
      </div>
    );
}

export default Login;
