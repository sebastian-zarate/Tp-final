"use client"
import React, { use } from 'react';
import { useEffect, useState } from 'react';
import { getUserByUserName, getUser, getAllUser } from '@/services/users';
import { createChat, type Chat } from '@/services/chats';
import { getMensajesNoLeidos } from '@/services/mensajes';
import ChatImage from '../Images/BackgroundChat4.jpg'
import Image from 'next/image';
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
  const [username, setUsername] = useState("");
  const [chats2, setChats] = useState<any[]>([]);
  const [unreadMessages, setUnreadMessages] = useState<{ [key: string]:  string}>({});
  const [notificacion , setNotificacion] = useState<boolean>(false);
  const [list, setList] = useState([])

  useEffect(() => {
    const fetchUnreadMessages = async () => {
      const unreadMessages = await getUnreadMessagesCount(chats);
      setUnreadMessages(unreadMessages);
      console.log("unreadMessages", unreadMessages);
    };
  
    fetchUnreadMessages();
  }, [chats]);

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

  


  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };


  const handleCreateChat = async (event: React.FormEvent) => {
    event.preventDefault();

    const currentUser = await getUser(userId);
    const selectedUser = await getUserByUserName(username);
    let l = await getAllUser()
    //setList(l)
    console.log("listaaaaaaaaaaaaa--", list)
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

    // add the new chat to the list
    setChats(prevChats => [...prevChats, chat]);

    // clear the username field
    setUsername("");
  };
  /*
  if (!mostrarMensajeria || !userLoaded) {
    return null;
  }*/
/*   const list = getAllUser().then(res => res) */
  

console.log("listaaaaaaaaaaaaa--", list)
  const handleRedirect = (chatid: string, userid: string) => {
    window.location.href = `/chat`
    console.log("chatid", chatid)
    localStorage.setItem('chatId', chatid)
    localStorage.setItem('userId', userid)
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
                    <select name="usuarios" id="us" className="text-center" required aria-placeholder='Usernamee'>
                       {list.map((x, index) => (
                             <option key={index} value={x} >{index}.{x}</option>
                        ))} 
                       
                    </select>  
          <button type="submit" className='  px-2 mt-1 w-1/4 rounded-md bg-gray-400 hover:bg-gray-600'>Create chat</button>
        </form>
        <div>
          <ul className='flex flex-col items-center'>
            {chats.map((chat: any, index: number) => (
              <li key={chat.id} className='flex flex-row justify-around items-center space-x-4'>
                <h2> ({chat.id}) Chat: {chatnames[index]} {unreadMessages[chat.id]} </h2>
                <button onClick={() => handleRedirect(chat.id, userId)} className=' px-2 rounded-md bg-gray-400 hover:bg-gray-600'>abrir </button>
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