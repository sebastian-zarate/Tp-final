"use client"
import { authenticateUser, getUserByemail } from "@/services/users"
import backgroundImage from '../../../public/Images/Papyre.png';
import imageLogin from '../../../public/Images/InputLogin.jpg';
import containerImage from '../../../public/Images/Container.png';
import VikingoShield from '../../../public/Images/VikingoShieldAxeSinFondo.png'
import VikingoSword from '../../../public/Images/VikingoSwordSombreado.png'
import Image from "next/image";
import { useEffect, useState } from "react";

function Login(){
    const [boxError, setBoxError] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
      if(boxError){
        const intervalId = setInterval(() => {
          setBoxError(false)
          }, 3000);
          return () => clearInterval(intervalId);
      }
    }, [boxError])
    async function logUser(data:FormData) {
        //'use server'
        const user = {
          /* username: data.get('username') as string, */
          dataUser: data.get('dataUser') as string,
          password: data.get('password') as string
        }
        const authUser = await authenticateUser(user) 
        if (typeof authUser === "string") {
          setError(authUser)          
          return setBoxError(true)
        }
        window.location.replace('/principal')
     
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
            {boxError && 
              <div className=" text-white rounded w-80 py-4 px-8 absolute top-20 bg-red-400 bg-opacity-80">
                  {/* <button className="absolute top-0 right-1 " onClick={()=> {setBoxError(false); setError("")}}>X</button> */}
                    <h1 className=" flex justify-center items-center font-stoothgart text-black-400 ">{error}</h1>                
              </div>
            }
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
      
          <a href="/signup" className="mt-5 text-lg font-stoothgart text-yellow-400">No tengo Cuenta</a>   
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
