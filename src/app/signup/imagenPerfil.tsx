import React from "react";
import gargar from "../../../public/Images/profileImg/gargar.png";
import abednego from "../../../public/Images/profileImg/abednego.png";
import jacobo from "../../../public/Images/profileImg/jacobo.png";
import luis from "../../../public/Images/profileImg/luis.png";
import karma from "../../../public/Images/profileImg/karma.png";
import sejuani from "../../../public/Images/profileImg/sejuani.png";
import Image from "next/image";

interface ImagenPerfilProps {
    mostrar: boolean
    handleMostrar: () => void
    handleImagenSeleccionada: (imagen: string) => void
}
const ImagenPerfil: React.FC<ImagenPerfilProps>= ({mostrar, handleMostrar, handleImagenSeleccionada}) => {

    const imagenes = [gargar, abednego, jacobo, luis, karma, sejuani];
    const nombreImagenes: {[key: number]: string} ={
            0: "Gargar",
            1: "Abednego",
            2: "Jacobo",
            3: "Luis",
            4: "Karma",
            5: "Sejuani"
        }
    const handleSeleccionarImagen = (index: number) => {
        //devuelve el nombre de la imagen seleccionada
        console.log("imagen seleccionada: ", nombreImagenes[index]);
        //agarra la imagen que seleccione
        handleImagenSeleccionada(nombreImagenes[index]);
        handleMostrar();
    }

    if (mostrar) {
        return (

            <div className="flex flex-wrap justify-around absolute z-9999 bg-white w-1500 h-1500">
                {imagenes.map((imagen, index) => (
                    <div key={index} className="w-1/3 p-1" onClick={() => handleSeleccionarImagen(index)}>
                        <Image src={imagen} alt={`Profile ${index}`} width={120} height={120} />
                    </div>
                ))}
            </div>
        )
    }
    else return null
}
export default ImagenPerfil;

