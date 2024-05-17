"use server"
import { Edificios } from "@prisma/client";
import { getUser, updateUser } from "./users";
import { getOneEdificio, updateEdificioUltimaInteraccion } from "./edificios";
import {getUEbyUserId, getUEbyUserIdEdId, updateUE} from "./userEdificios"
import { Console } from "console";
import { get } from "http";


export async function calcularTiempo(date: any){
    //fecha acutal
    const fechaAhora = new Date();
    const diferencia = fechaAhora.getTime() - date.getTime();
    const minutos = Math.floor(diferencia / 60000);
    console.log("minutos transcurridos: ", minutos);
    return minutos;
}

//METODO VIEJO SEGURAMENTE HALLA QUE BORRARLO EN EL FUTURO


export async function recolectarRecursos(userId: string){
    //Tengo el user y el edificio del user
    const user = await getUser(userId);
    const listaedificio = await getUEbyUserId(userId);
    //calcular los recursos generados
    console.log("--------------->Edificios del jugador: ", listaedificio);
    //agregar los recursos generados al usuario
    //sumar los recursos generados para despues hacer el userUpdate
    let madera = Number(user?.madera);
    let piedra = Number(user?.piedra);
    let pan = Number(user?.pan);
    //recorrer la lista de edificios del usuario para sumar los recursos de cada edificio
    listaedificio.forEach(async (userEdificio) => {
        //para buscar en la bdd el edificio y su tipo de recurso
        const edificio = await getOneEdificio(userEdificio.edificioId);
        const minutos = await calcularTiempo(userEdificio.ultimaInteraccion);
        console.log("#################$$$$$$$$$$$$$$$$$$ minutosssssssssss: ", minutos);
        if(edificio != null){
            console.log("----------->Edificio encontrado: ", edificio);
            if(edificio.tipoRecurso == "madera"){
                let maderaEdificio = 0
                //la madera recolectada por el tiempo transcurrido
                maderaEdificio += Number(edificio.recursoPorMinuto) * minutos
                //sumar la madera extra por la cantidad de trabajadores (1% mas por trabajador)
                maderaEdificio = Math.ceil(maderaEdificio * (1 + (Number(userEdificio.trabajadores)  * 0.01)))
                console.log("++++++++++++++++++++++++++++++>maderaEdificio: ", maderaEdificio);
                console.log("++++++++++++++++++++++++++++++>maderaEdificio + mader: ", (maderaEdificio + madera));
                madera += maderaEdificio
                //actualizar edificio con la ultima interaccion
                console.log("----------->horario a actualizar: ", userEdificio.ultimaInteraccion);
                await updateUE(userEdificio.id, {ultimaInteraccion: new Date()})
                await updateUser(userId, {madera: madera});
                console.log("----------->horario actualizado: ", userEdificio.ultimaInteraccion);
            }
            else if(edificio.tipoRecurso == "piedra"){
                let piedraEdificio = 0
                //la piedra recolectada por el tiempo transcurrido
                piedraEdificio += Number(edificio.recursoPorMinuto) * minutos
                //sumar la piedra extra por la cantidad de trabajadores (1% mas por trabajador)
                piedraEdificio = Math.ceil(piedraEdificio * (1 + (Number(userEdificio.trabajadores)  * 0.01)))
                console.log("++++++++++++++++++++++++++++++>piedraEdificio: ", piedraEdificio);
                console.log("++++++++++++++++++++++++++++++>piedraEdificio + piedra: ", (piedraEdificio + piedra));
                piedra += piedraEdificio
                console.log("----------->horario a actualizar: ", userEdificio.ultimaInteraccion);
                await updateUE(userEdificio.id, {ultimaInteraccion: new Date()})
                await updateUser(userId, {piedra: piedra});
                console.log("----------->horario actualizado: ", userEdificio.ultimaInteraccion);
            }
            else if(edificio.tipoRecurso == "pan"){
                let panEdificio = 0
                //el pan recolectado por el tiempo transcurrido
                panEdificio += Number(edificio.recursoPorMinuto) * minutos
                //sumar el pan extra por la cantidad de trabajadores (1% mas por trabajador)
                panEdificio = Math.ceil(panEdificio * (1 + (Number(userEdificio.trabajadores)  * 0.01)))
                pan += panEdificio
                console.log("----------->horario a actualizar: ", userEdificio.ultimaInteraccion);
                await updateUE(userEdificio.id, {ultimaInteraccion: new Date()})
                await updateUser(userId, {pan: pan});
                console.log("----------->horario actualizado: ", userEdificio.ultimaInteraccion);
            }
        }
    });

    //actualizar los recursos del user
    
}