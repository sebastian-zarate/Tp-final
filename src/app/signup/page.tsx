import { createUser } from "@/services/users";
import { redirect } from 'next/navigation';
import backgroundImage from '../../../public/Images/Papyre.png'; // Importa la imagen
import registerButton from '../../../public/Images/InputMod.jpg';
import containerImage from '../../../public/Images/Container.png';
import VikingoImage from '../../../public/Images/VikingoCadenasSombreado.png'
import Vikingo2Image from '../../../public/Images/VikingoEspadaSombreado.png'
import Image from "next/image";
async function Signup() {

  async function createUs(data: FormData) {
    "use server"
    const email = data.get('email') as string;
    const password = data.get('password') as string;
    const username = data.get('username') as string;
    const profileImage = data.get('profileImage') as File;
    const user = {
      email: email,
      password: password,
      username: username,
      profileImage: profileImage.toString()
    };
    await createUser(user);
    redirect('/login');
  }

  return (
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
        padding: 0
      }}
    >
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
        <form className="flex flex-col items-center" action={createUs}>
          <label htmlFor="username" className="self-start text-lg font-stoothgart text-yellow-400">Username</label>
          <input className="border px-2 mb-4 w-full rounded text-white" style={{ backgroundColor: 'rgba(172, 122, 27, 1)' }} type="text" id="username" name="username" required />
          <label htmlFor="email" className="self-start text-lg font-stoothgart text-yellow-400">Email</label>
          <input className="border px-2 mb-4 w-full rounded text-white" style={{ backgroundColor: 'rgba(172, 122, 27, 1)' }} type="email" id="email text-yellow-400" name="email" required />
          <label htmlFor="password" className="self-start text-lg font-stoothgart text-yellow-400">Password</label>
          <input className="border px-2 mb-4 w-full rounded text-white" style={{ backgroundColor: 'rgba(172, 122, 27, 1)' }} type="password" id="password" name="password" required />
          <label htmlFor="profileImage" className="self-start text-lg font-stoothgart text-yellow-400">Profile Image</label>
          <input type="file" id="profileImage" name="profileImage" accept="image/*" className="mb-4 w-full text-lg font-stoothgart text-yellow-400"  />
          <button 
            type="submit"
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
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
  );
}

export default Signup;
