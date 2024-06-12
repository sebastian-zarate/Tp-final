"use client"
import React, { use } from 'react';
import { useEffect, useState } from 'react';
import { getUserByUserName, getUser, getAllUser, getUserById } from '@/services/users';
import { createChat, deleteChatById, getAllChats, getChats, type Chat } from '@/services/chats';
import { getMensajesNoLeidos } from '@/services/mensajes';
import ChatImage from '../Images/BackgroundChat4.jpg'
import Image from 'next/image';
import Chats from '../chat/page';
import { arrayBuffer } from 'stream/consumers';
interface MensajeriaProps {
  userId: string;
  mostrarMensajeria: boolean;
  userLoaded: boolean;
  chats: Chat[];
  chatnames: string[];
  handleMensajeria: () => void;
  getMensajes: (id: string) => void;
}

const Mensajeria: React.FC<MensajeriaProps> = ({ userId, mostrarMensajeria, userLoaded, chats, chatnames, handleMensajeria, getMensajes }) => {
  //const [username, setUsername] = useState("");
  const [chats2, setChats] = useState<any[]>([]);
  const [unreadMessages, setUnreadMessages] = useState<{ [key: string]:  string}>({});
  const [notificacion , setNotificacion] = useState<boolean>(false);
  const [list, setList] = useState<string[]>([""]);

/*  useEffect(()=> {

  const intervalId = setInterval(() => {
    if(chats2.length != 0 && userId){
      getAllChats(userId).then(c => {
        setChats(c)
      })
    }
  }, 5000);
  
  return () => clearInterval(intervalId);
 },[chats2, userId]) */

   /* if (chats2.length == 0)obtenerChats(); */
  useEffect(() => {
    const fetchUnreadMessages = async () => {
      const unreadMessages = await getUnreadMessagesCount(chats);
      setUnreadMessages(unreadMessages);
      console.log("unreadMessages", unreadMessages);
    };      
    fetchUnreadMessages();

  }, [chats2]);
  
  //USEEFFECT PARA ELIMINAR DE LA LISTA A LOS USUARIOS QUE YA LOS TENGO COMO AMIGOS
  useEffect(() => {
  //OBTENER TODOS LOS USERS 
    async function fetchUsers() {
      const currentUser = await getUserById(userId)
      if(list[0] == ""){
        setChats(chats)
        try {
          const array= []
          const users = await getAllUser()  //obtengo todos los usuarios

          for (let index = 0; index < users.length; index++) {

            if(users[index].username != currentUser?.username) {
                array.push(String(users[index].username))                     //pusheo los usernames en un array                  
            }               
          }
          //seteo la lista de usernames
          setList(array)
          console.log("listaaaaaaaaaaaaa--", list)
        } catch (error) {
            console.error('Error al obtener la lista de usuarios:', error);
        }
      }
    }
    fetchUsers(); 
    setChats(chats)
  }, [chats])

  useEffect(() => {

        //Método para eliminar un elemento de la lista
        const removeElementByValue = (valueToRemove:any) => {
          const newList = list.filter((item) => item !== valueToRemove);
          setList(newList);
        };
          async function deleteUsersList() {
            const currentUser = await getUserById(userId)
      
            for (let index = 0; index < list.length; index++) {
      
              if(list[index] != currentUser?.username) {
      
                for(let i=0; i< chatnames.length; i++){
                  if(list[index] == chatnames[i]){
                    removeElementByValue(list[index])      // Elimina 1 elemento del array que ya existe en la lista de chats                            
                  } 
                }               
              }               
            }
          }
      deleteUsersList()
      //setChats(chats)
    }, [list])

  //metodo para obtener los mensajes no leidos
  const getUnreadMessagesCount = async (chats: Chat[]) => {

    const unreadMessages: {[key: string]: string} = {};
    for(let chat of chats){
      const count = await getMensajesNoLeidos(chat.id, userId);
      if(count > 0){
        unreadMessages[chat.id] = `- No leidos: ${count}`;
        //avisar que hay mensajes no leidos
        setNotificacion(true);
      }
      else{
        unreadMessages[chat.id] = "";
      }
    }
    return unreadMessages;
  };

  

  const handleCreateChat = async (event: any) => {
    event.preventDefault();
    const data = new FormData(event.target);   

    const currentUser = await getUser(userId);
    const selectedUser = await getUserByUserName(String(data.get('usuarios')));
    if (!selectedUser || !currentUser) {
      alert("User not found");
      return;
    }
    // create the chat
    const chat = await createChat(
      {
        user1: userId,
        user2: selectedUser.id,
        username1: currentUser.username,
        username2: selectedUser.username,
      }
    );
    chatnames.push(chat.username2)
    // add the new chat to the list
    setChats(prevChats => [...prevChats, chat]);
    //window.location.reload()

    event.target.reset();

    // clear the username field
 //   setUsername("");
  };

  const handleRedirect = (chatid: string, userid: string) => {
    window.location.href = `/chat`
    console.log("chatid", chatid)
    localStorage.setItem('chatId', chatid)
    localStorage.setItem('userId', userid)
  }
  
  async function handleDelete(event: any) {  
    const elementoClicado = event.target as HTMLElement; 
    const idChat = elementoClicado.id;

    const chatDelted = await deleteChatById(idChat) 
    console.log("Se borro el chat:",idChat)
   // window.location.reload()
    chatDelted
    for (let i = 0; i < chatnames.length; i++) {
      if(chatnames[i]== chatDelted.username2){  
        chatnames.splice(i, 1); // Elimina 1 elemento a
      }      
    }
/*     for (let i = 0; i < chats2.length; i++) {
      if(chats2[i].id== idChat){  
        chats2.splice(i, 1); // Elimina 1 elemento a
      }      
    } */
    for (let i = 0; i < chats.length; i++) {
      if(chats[i].id== idChat){  
        chats.splice(i, 1); // Elimina 1 elemento a
      }      
    }
    setChats(chats)

    

  } 
  return (
    <React.Fragment>
    <div className=' font-stoothgart left-100 p-4 bg-red-500 hover:bg-blue-700 text-blue font-bold py-2 px-4 rounded flex items-center justify-center flex-col'>
        <button onClick={() => handleMensajeria()}>Chat</button>
        <h3 className={notificacion ? '' : 'hidden'}> Hay Mensajes sin leer!</h3>
      </div>
    <div className={`font-stoothgart fixed inset-0 w-full h-full z-50 bg-black bg-opacity-50 flex items-center justify-center ${mostrarMensajeria ? '' : 'hidden'}`} >
      <div className="relative w-1/2 h-1/2  rounded-lg">
      <Image
          src={ChatImage}
          alt="Background Image"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 w-full h-full"
          style={{ zIndex: -1, opacity: 100 }}
        />
        <button className="absolute top-2 right-2 text-lg font-bold" onClick={handleMensajeria}>X</button>
        <h1 className="text-1xl font-bold text-center">Mensajeria</h1>
        <form onSubmit={handleCreateChat} className=" mx-auto pb-4 flex flex-col items-center justify-center">            
                    <select name="usuarios" id="us" className="text-center" >
                       {list.map((user, index) => (
                             <option key={index} value={user} >{index +1}. {user}</option>
                        ))} 
                       
                    </select>  
          <button type="submit" className='  px-2 mt-1 w-1/4 rounded-md bg-gray-400 hover:bg-gray-600' >Create chat</button>
        </form>
        <div>
          <ul className='flex flex-col items-center'>
            {chats2.map((chat: any, index: number) => (
              <li key={chat.id} className='flex flex-row justify-around items-center space-x-4'>
                <h2> ({chat.id}) Chat: {chatnames[index]} {unreadMessages[chat.id]} </h2>
                <button onClick={() => handleRedirect(chat.id, userId)} className=' px-2 rounded-md bg-gray-400 hover:bg-gray-600'>abrir </button>
                <button id={chat.id} onClick={(e) => handleDelete(e)} className=' p-2 hover:bg-slate-300' >X</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
    </React.Fragment>
  );
};

export default Mensajeria;