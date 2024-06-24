'use client'
import React from "react";
import { useEffect, useState } from "react";
import { createUser } from "@/services/users";
import { redirect } from 'next/navigation';
import backgroundImage from '../../../public/Images/Papyre.png'; // Importa la imagen
import registerButton from '../../../public/Images/InputMod.jpg';
import containerImage from '../../../public/Images/Container.png';
import VikingoImage from '../../../public/Images/VikingoCadenasSombreado.png'
import Vikingo2Image from '../../../public/Images/VikingoEspadaSombreado.png'
import Image from "next/image";
import ImagenPerfil from "./imagenPerfil";
import InputProfileImage from '../../../public/Images/InputSeleccionarImagen.jpg'



const Signup: React.FC = () => {

  const [mostrar, setMostrar] = React.useState<boolean>(false)
  const [imagenSeleccionada, setImagenSeleccionada] = React.useState<string>("Seleccionar")

  const [boxError, setBoxError] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (boxError) {
      const intervalId = setInterval(() => {
        setBoxError(false)
      }, 3000);
      return () => clearInterval(intervalId);
    }
  }, [boxError])
  //para mostrar el componente para seleccionar imagenes
  const handleMostar = () => {
    setMostrar(!mostrar)
  }

  const createU = async (data: any) => {
    const creatU = await createUser(data)
    if (typeof creatU === "string") {
      setError(creatU)
      return setBoxError(true)
    }
    window.location.href = "/login"
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    let fotoPerfil = ""
    if (imagenSeleccionada === "Seleccionar") {
      fotoPerfil = "foto.png"
    }
    else {
      fotoPerfil = imagenSeleccionada.toLowerCase() + ".png"
      console.log(fotoPerfil)
    }
    const data = {
      email: (event.target as any).email.value,
      password: (event.target as any).password.value,
      username: (event.target as any).username.value,
      profileImage: fotoPerfil

    }
    createU(data)

  }

  const handleImagenSeleccionada = (imagen: string) => {
    setImagenSeleccionada(imagen)
  }




  return (
    <>

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
        }}
      >
        <h1 style={{ position: 'absolute', top: 20 }} className="border-solid mb-4 text-5xl font-stoothgart text-black">Las Aventuras de Juan el vikingo</h1>
        {boxError &&
          <div className=" text-white rounded w-80 py-4 px-8 absolute top-20 bg-red-400 bg-opacity-80">
            {/* <button className="absolute top-0 right-1 " onClick={()=> {setBoxError(false); setError("")}}>X</button> */}
            <h1 className=" flex justify-center items-center font-stoothgart text-black-400 ">{error}</h1>
          </div>
        }
        <div
          className="flex flex-col mt-16 p-16 items-center"
          style={{
            backgroundImage: `url(${containerImage.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative', // Necesario para posicionar los elementos hijos correctamente
          }}
        >

          <h1 className="border-solid text-3xl mb-4 font-stoothgart text-yellow-400">Signup</h1>
          <form className="flex flex-col items-center" onSubmit={handleSubmit}>
            <label htmlFor="username" className="self-start text-lg font-stoothgart text-yellow-400">Username</label>
            <input className="border px-2 mb-4 w-full rounded text-white" style={{ backgroundColor: 'rgba(172, 122, 27, 1)' }} type="text" id="username" name="username" required />
            <label htmlFor="email" className="self-start text-lg font-stoothgart text-yellow-400">Email</label>
            <input className="border px-2 mb-4 w-full rounded text-white" style={{ backgroundColor: 'rgba(172, 122, 27, 1)' }} type="email" id="email text-yellow-400" name="email" required />
            <label htmlFor="password" className="self-start text-lg font-stoothgart text-yellow-400">Password</label>
            <input className="border px-2 mb-4 w-full rounded text-white" style={{ backgroundColor: 'rgba(172, 122, 27, 1)' }} type="password" id="password" name="password" required />
            <label htmlFor="profileImage" className="self-start text-lg font-stoothgart text-yellow-400">Profile Image: {imagenSeleccionada}</label>
            <button type="button" onClick={() => handleMostar()} style={{ background: 'none', border: 'none', padding: 10, cursor: 'pointer' }}><Image src={InputProfileImage} alt="Seleccionar Imagen" /></button>
            <ImagenPerfil mostrar={mostrar} handleMostrar={handleMostar} handleImagenSeleccionada={handleImagenSeleccionada} />
            <button
              type="submit"
              style={{
                background: 'none',
                border: 'none',
                padding: 10,
                cursor: 'pointer'
              }}
            >
              <Image src={registerButton} alt="Registrarse" />
            </button>
          </form>
          <a href="/login" className="mt-4 text-lg font-stoothgart text-yellow-400">Ya tengo mi cuenta creada</a>
          <div className="p-3 text-lg border flex flex-col mt-4 font-stoothgart text-yellow-400">
            <span id="em_caract">El email es mayor a 5 caracteres?</span>
            <span id="em_simb">¿El email incluye el símbolo "@"?</span>
            <span id="cont_caract">¿La contraseña es mayor a 8 caracteres?</span>
            <span id="use_caract">¿El username es mayor a 3 caracteres?</span>
          </div>
          <Image
            src={VikingoImage}
            alt="Vikingo decorativo"
            style={{
              position: 'absolute',
              top: '10%',
              left: '-75%',
              width: '50%',
              height: '85%'
            }}
          />
          <Image
            src={Vikingo2Image}
            alt="Vikingo decorativo"
            style={{
              position: 'absolute',
              top: '10%',
              right: '-90%',
              width: '60%',
              height: '90%'
            }}
          />
        </div>
      </div>
    </>
  );
}

export default Signup;
