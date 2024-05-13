"use server"
import { Edificios } from "@prisma/client";
import { getOneEdificio, updateEdificioUltimaInteraccion } from "./edificios";
import { Console } from "console";


export async function calcularTiempo(date: Date){
    //fecha acutal
    const fechaAhora = new Date();
    const diferencia = fechaAhora.getTime() - date.getTime();
    const minutos = Math.floor(diferencia / 60000);
    console.log("minutos transcurridos: ", minutos);
    return minutos;
}

export async function calcularRecursosGenerados(){
    console.log("Calculando recursos generados..........................");
    const edificio = await getOneEdificio("663ac05f044ccf6167cf7041")
    const UltimaInteraccion = edificio?.ultimaInteraccion
    console.log("Ultima interaccion: ", UltimaInteraccion);
    if (!UltimaInteraccion) {
       
        return 0;
    }
    const minutos = await calcularTiempo(new Date(UltimaInteraccion))
    if(!edificio.recursoPorMinuto){
        return 0;
    }
    const ratio = Number(edificio.recursoPorMinuto)
    const recursosGenerados = minutos * ratio * edificio.nivel;
    console.log("-----------> Recursos generados: ", recursosGenerados);
    //actualizar la ultima interaccion
    await updateEdificioUltimaInteraccion("663ac05f044ccf6167cf7041", new Date());
    //devolver los recursos generados
    return recursosGenerados;
    
}