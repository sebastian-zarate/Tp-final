import { use, useEffect, useState } from "react";
import React from "react";
import backgroundImage from '../../../public/Images/Papyre.png';
interface pantallaCargaProps {
    cargandoPrincipal: boolean
    cargandoChats: boolean
    cargandoImagenes: boolean
}
const PantallaCarga: React.FC<pantallaCargaProps> = ({ cargandoPrincipal, cargandoChats, cargandoImagenes }) => {

    const [puntos, setPuntos] = useState(".");

    useEffect(() => {
        if (cargandoPrincipal || cargandoChats || cargandoImagenes) {
            const interval = setInterval(() => {
                if(puntos.length > 3){ 
                setPuntos(".")}
                else setPuntos(puntos + ".");
            }, 400);
            return () => clearInterval(interval);
        }
    }, [puntos]);

    //para el texto de la carga del perfil
    const handleCargandoPerfil = () => {
        if(cargandoPrincipal){
            return "Cargando perfil" + puntos
        }
        else{
            return "Perfil cargado!"
        }
    }

    const handleCargandoChats = () => { 
        if(cargandoChats){
            return "Cargando chats" + puntos
        }
        else{
            return "Chats cargados!"
        }
    }

    const handleCargandoImagenes = () => {
        if(cargandoImagenes){
            return "Cargando Edificios" + puntos
        }
        else{
            return " Edificios cargados!"
        }
    }
 
    if (cargandoPrincipal || cargandoChats || cargandoImagenes) {
        return (
            <div className="flex flex-col items-center justify-center fixed inset-0 w-full h-full z-50 " style={{
                backgroundImage: `url(${backgroundImage.src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>

                <h1 className="border-solid mb-4 text-8xl font-stoothgart text-black-500">Cargando{puntos}</h1>
                <h2 className="text-4xl font-stoothgart text-black-500">{handleCargandoPerfil()}</h2>
                <h2 className="text-4xl font-stoothgart text-black-500">{handleCargandoChats()}</h2>
                <h2 className="text-4xl font-stoothgart text-black-500">{handleCargandoImagenes()}</h2>
            </div>
        )
    }
    else null
}

export default PantallaCarga;