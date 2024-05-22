"use server"
import { Edificios } from "@prisma/client";
import { getUser, updateUser } from "./users";
import { getOneEdificio, updateEdificioUltimaInteraccion } from "./edificios";
import { getUEbyUserId, getUEbyUserIdEdId, updateUE } from "./userEdificios"
import { Console } from "console";
import { get } from "http";


export async function calcularTiempo(date: any) {
    //fecha acutal
    if (date == null) {
        return 0;
    }
    else {
        const fechaAhora = new Date();
        const diferencia = fechaAhora.getTime() - date.getTime();
        const minutos = Math.floor(diferencia / 60000);
        console.log("minutos transcurridos: ", minutos);
        return minutos;
    }
}

//METODO VIEJO SEGURAMENTE HALLA QUE BORRARLO EN EL FUTURO


export async function recolectarRecursos(userId: string) {
    //Tengo el user y el edificio del user
    const user = await getUser(userId);
    const listaedificio = await getUEbyUserId(userId);
    //calcular los recursos generados
    console.log("--------------->Edificios del jugador: ", listaedificio);
    //agregar los recursos generados al usuario
    //sumar los recursos generados para despues hacer el userUpdate
    let madera = 0
    let piedra = 0
    let pan = 0
    //recorrer la lista de edificios del usuario para sumar los recursos de cada edificio
    for (const userEdificio of listaedificio) {
        //para buscar en la bdd el edificio y su tipo de recurso
        const edificio = await getOneEdificio(userEdificio.edificioId);
        const minutos = await calcularTiempo(userEdificio.ultimaInteraccion);
        if (user != null && edificio != null) {
            if (edificio.tipoRecurso == "madera") {

                let maderaEdificio = 0
                //la madera recolectada por el tiempo transcurrido
                maderaEdificio += Number(edificio.recursoPorMinuto) * minutos
                //sumar la madera extra por la cantidad de trabajadores (1% mas por trabajador)
                maderaEdificio = Math.ceil(maderaEdificio * (1 + (Number(userEdificio.trabajadores || 0) * 0.01)))
                madera += maderaEdificio
                //actualizar edificio con la ultima interaccion
                await updateUE(userEdificio.id, { ultimaInteraccion: new Date() })
                //sumar la madera al usuario
                console.log(`userId:${user.id}/ edificioId:${userEdificio.id} / tipoRecurso: ${edificio.tipoRecurso} / recursoGenerado: ${maderaEdificio} / minutos: ${minutos} / trabajadores: ${userEdificio.trabajadores}`)
                //  await updateUser(userId, {madera: maderaEdificio});
                console.log(" f1 Madera TOTALLLLLLLLLLLLLLLLLLLLLLLL: ", madera);
            }
            else if (edificio.tipoRecurso == "piedra") {
                let piedraEdificio = 0
                //la piedra recolectada por el tiempo transcurrido
                piedraEdificio += Number(edificio.recursoPorMinuto) * minutos
                //sumar la piedra extra por la cantidad de trabajadores (1% mas por trabajador)
                piedraEdificio = Math.ceil(piedraEdificio * (1 + (Number(userEdificio.trabajadores) * 0.01)))
                piedra += piedraEdificio
                await updateUE(userEdificio.id, { ultimaInteraccion: new Date() })
                //await updateUser(userId, {piedra: piedraEdificio});
                console.log(`userId:${user.id}/ edificioId:${userEdificio.id} / tipoRecurso: ${edificio.tipoRecurso} / recursoGenerado: ${piedraEdificio} / minutos: ${minutos} / trabajadores: ${userEdificio.trabajadores}`)
                console.log(" f2 Piedra TOTALLLLLLLLLLLLLLLLLLLLLLLL: ", piedra);
            }
            else if (edificio.tipoRecurso == "pan") {
                let panEdificio = 0
                //el pan recolectado por el tiempo transcurrido
                panEdificio += Number(edificio.recursoPorMinuto) * minutos
                //sumar el pan extra por la cantidad de trabajadores (1% mas por trabajador)
                panEdificio = Math.ceil(panEdificio * (1 + (Number(userEdificio.trabajadores) * 0.01)))
                pan += panEdificio
                // await updateUE(userEdificio.id, {ultimaInteraccion: new Date()})
                console.log(`userId:${user.id}/ edificioId:${userEdificio.id} / tipoRecurso: ${edificio.tipoRecurso} / recursoGenerado: ${panEdificio} / minutos: ${minutos} / trabajadores: ${userEdificio.trabajadores}`)
                // await updateUser(userId, {pan: panEdificio});


            }
        }
    }

    // hacer console.log de los recursos generados

    //actualizar el usuario con los recursos generados
    await updateUser(userId, { madera: Number(user?.madera || 0) + madera, piedra: Number(user?.piedra || 0) + piedra, pan: Number(user?.pan || 0) + pan });
}