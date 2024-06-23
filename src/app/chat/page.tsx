'use client'
import React from "react"
import { useEffect, useState } from "react";
import { createMensaje, getMensajes, updateMensaje } from "@/services/mensajes";
import { getReturnByCooki, getUser, updateUserRecursos } from "@/services/users";
import { getChatNameById } from "@/services/chats";
import { recurNegat } from "@/helpers/error";
import Image from "next/image";
import BackgroundImage from '../../../public/Images/BackgroundChat4.jpg';


const Chats: React.FC = () => {

    const [mensajes, setMensajes] = useState<any[]>([])
    const [chatId, setChatId] = useState<string>("")
    const [username, setUsername] = useState<string>("")
    const [userId, setUserId] = useState<string>("")
    const [usernameOther, setUsernameOther] = useState<string>("")
    const [boxError, setBoxError] = useState(false)
    const [error, setError] = useState("")


    //region verficar la cookie------------------
    let estado = false;

    useEffect(() => {
        async function verificarCooki() {
            //obtengo el valor de la cookie user
            if (!estado) {
                await getReturnByCooki()
                estado = !estado
            }

        }
        verificarCooki()
        const intervalId = setInterval(() => {
            estado = !estado

        }, 5000);
        return () => clearInterval(intervalId);
    }, [estado])
    //------------------------------------------------

    //region Uso de errores
    useEffect(() => {
        if (boxError) {
            const intervalId = setInterval(() => {
                setBoxError(false)
            }, 3000);
            return () => clearInterval(intervalId);
        }
    }, [boxError])


    useEffect(() => {
        const chatLocalStorage = localStorage.getItem('chatId')     //obtengo el id del chat del localStorage
        const userIdLocalStorage = localStorage.getItem('userId')   //obtengo el id del useario del localStorage

        //conseguir chatId
        if (chatLocalStorage) {
            setChatId(chatLocalStorage as string)

            console.log("chatId", chatLocalStorage)
        }

        //conseguir userId
        if (userIdLocalStorage) {
            getUser(userIdLocalStorage as string).then(res => {
                if (res) {
                    setUserId(res.id)
                    setUsername(res.username)
                    console.log("--------------------------->username", res.username)
                }
            })
        }

        //conseguir mensajes
        if (chatId !== "") {
            getMensajes(chatId).then(res => {
                setMensajes(res)
            })
        }

        //conseguir el username del receptor del mensaje
        if (chatId !== "" && userId !== "") {
            getChatNameById(chatId, userId).then(setUsernameOther)
        }

    }, [chatId, userId])

    //refrescar por si me mandaron mensajes*/
    useEffect(() => {
        if (chatId !== "") {
            getMensajes(chatId).then(mensajes => {
                setMensajes(mensajes);
            });
        }

        const intervalId = setInterval(() => {
            if (chatId !== "" && username !== "") {
                console.log(`Refrescando mensajes ${username}`)
                getMensajes(chatId).then(mensajes => {
                    setMensajes(mensajes);
                    handleLeerMensajes(mensajes);
                });
            }
        }, 5000);

        return () => clearInterval(intervalId);
    }, [chatId, userId]);

    const handleLeerMensajes = async (mensajes: any) => {
        console.log("Leyendo los Mensajes: ", mensajes)
        for (let mensaje of mensajes) {
            //si el mensaje no fue leido y el emisor no soy yo comparando usernames
            if (mensaje.leido === false && mensaje.emisorUserName !== username) {
                await updateMensaje(mensaje.id, { leido: true })
                console.log("--------------------->Mensaje leido: ", mensaje)
            }
        }
    }

    const handleSubmit = async (event: any) => {
        event.preventDefault();

        // get form data
        const data = new FormData(event.target);

        // create the message object
        const mensaje = {
            chatId: chatId,
            emisor: String(userId),   //soy yo
            emisorUserName: String(username),
            madera: Number(data.get("madera")),
            pan: Number(data.get("pan")),
            piedra: Number(data.get("piedra")),
            texto: data.get("mensaje") as string,
            fecha: new Date(),
            leido: false // nuevo atributo para saber si el mensaje fue leido
        }

        if (mensaje.madera < 0 || mensaje.piedra < 0 || mensaje.pan < 0) {
            setError(recurNegat)
            setBoxError(true)
            return event.target.reset();
        }

        //se actualizan los recursos del emisor y receptor   
        const updatRec = await updateUserRecursos(userId, usernameOther, mensaje.madera, mensaje.piedra, mensaje.pan)
        if (typeof updatRec === "string") {
            console.log(`STRINGGGGGG: ${updatRec}`)
            setError(updatRec)
            setBoxError(true)
            return event.target.reset();
        }
        // create the message
        const m = await createMensaje(mensaje);
        console.log("El mensaje creado: ", m);
        setMensajes(prevMensajes => [...prevMensajes, m]);
    }

    return (
        <main style={{
            backgroundImage: `url(${BackgroundImage.src})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            minHeight: '100vh',
            width: '100vw',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            {boxError &&
                <div className="absolute top-10 left-1/2 transform -translate-x-1/2 p-4 bg-yellow-500 text-black font-bold py-2 px-4 rounded z-50">
                    <h1 className=" flex justify-center items-center font-stoothgart text-black-400 ">{error}</h1>
                </div>
            }
            <div className="flex flex-col justify-center items-center mt-16 p-8 w-full">
                <div style={{
                    backgroundColor: 'rgba(25, 38, 47, 255)',
                    border: '2mm ridge rgba(82, 47, 1, .9)'
                }} className="w-8/12 flex justify-between p-5 border m-5 font-stoothgart text-lg text-yellow-400">
                    <h1>Chateando con {usernameOther}</h1>
                </div>

                <div style={{
                    backgroundColor: 'rgba(25, 38, 47, 255)',
                    border: '2mm ridge rgba(82, 47, 1, .9)'
                }} className="bg-white p-10 m-2 w-8/12 flex-col flex justify-between font-stoothgart">
                    <div style={{
                        backgroundColor: 'rgba(249,235,198)',
                        border: '2mm ridge rgba(0, 0, 0, .7)'
                    }} className="p-5 flex flex-col text-sm bg-slate-300 overflow-auto max-h-[500px]">
                        {mensajes.map((mensaje, index) => (
                            <div key={index} className="m-2">
                                <span className="text-slate-900 text-s">- {mensaje.emisorUserName} - {mensaje.fecha.toLocaleDateString()} -{mensaje.fecha.toLocaleTimeString()}</span>
                                <div style={{
                                    backgroundColor: 'rgba(86,30,8,255)',
                                    border: '2mm ridge rgba(0, 0, 0, .7)'
                                }} className="w-2/6 border p-3 rounded-xs text-base text-white">
                                    <span>{mensaje.texto}</span>
                                </div>
                                {mensaje.madera > 0 && <span className="text-slate-500 text-xs">- Madera: {mensaje.madera}</span>}
                                {mensaje.piedra > 0 && <span className="text-slate-500 text-xs">- Piedra: {mensaje.piedra}</span>}
                                {mensaje.pan > 0 && <span className="text-slate-500 text-xs"   >- Pan:    {mensaje.pan}</span>}
                            </div>
                        ))}
                    </div>

                    <form className="flex pt-5 flex-col font-stoothgart" onSubmit={handleSubmit}>
                        <label style={{ fontSize: 18 }} htmlFor="mensaje" className="text-yellow-400">Mensaje</label>
                        <textarea style={{
                            backgroundColor: 'rgb(172, 122, 27, 1)',
                            border: '2mm ridge rgba(0, 0, 0, .7)'
                        }} className="h-20 w-full resize-none text-white" name="mensaje" placeholder="Límite de caractéres: 300"></textarea>

                        <h3 style={{ fontSize: 18 }} className="flex justify-center items-center text-yellow-400">Desea donar algún recurso?</h3>
                        <div style={{
                            backgroundColor: 'rgba(172, 122, 27, 1)',
                            border: '2mm ridge rgba(0, 0, 0, .7)'
                            
                        }} className="border ">
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <label htmlFor="madera">Madera:</label>
                                <input style={{ border: '2mm ridge rgba(0, 0, 0, .7)' }} id="madera" type="number" name="madera" />
                            </div>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <label htmlFor="piedra">Piedra:</label>
                                <input style={{ border: '2mm ridge rgba(0, 0, 0, .7)' }} id="piedra" type="number" name="piedra" />
                            </div>
                            <div style={{ display: 'flex', gap: '34px' }}>
                                <label htmlFor="pan">Pan:</label>
                                <input style={{ border: '2mm ridge rgba(0, 0, 0, .7)' }} id="pan" type="number" name="pan" />
                            </div>
                        </div>
             
                    <div style={{ display: 'flex'}}>
                        <button type="submit" style={{
                            backgroundColor: 'rgba(131, 1, 21, 255)',
                            border: '2mm ridge rgba(0, 0, 0, .7)',
                            fontSize: 20,
                            flex: 1,
                            margin: '5px'
                        }} className="bg-blue-500 hover:bg-blue-700 text-yellow-400">Enviar</button>
                           
                           <a href="/principal" style={{
                            backgroundColor: 'rgba(131, 1, 21, 255)',
                            border: '2mm ridge rgba(0, 0, 0, .7)',
                            fontSize: 20,
                            flex: 1,
                            margin: '5px',
                            textAlign: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }} className="hover:bg-blue-700 font-stoothgart text-yellow-400">Principal</a>
                        </div>
              </form>
                        
                
                </div>
            </div>
        </main>
    );

}
export default Chats;