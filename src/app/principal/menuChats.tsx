"use client"
import React, { use } from 'react';

interface MensajeriaProps {
  userId: string;
  mostrarMensajeria: boolean;
  userLoaded: boolean;
  chats: any[];
  chatnames: string[];
  handleMensajeria: () => void;
  getMensajes: (id: string) => void;
}

const Mensajeria: React.FC<MensajeriaProps> = ({ userId, mostrarMensajeria, userLoaded, chats, chatnames, handleMensajeria, getMensajes }) => {
  if (!mostrarMensajeria || !userLoaded) {
    return null;
  }

  const handleRedirect = (chatid: string, userid: string) => {
    window.location.href = `/chat`
    console.log("chatid", chatid)
    localStorage.setItem('chatId', chatid)
    localStorage.setItem('userId', userid) 
 }
  return (
    <div className="fixed inset-0 w-full h-full z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative w-1/2 h-1/2 bg-white rounded-lg">
        <button className="absolute top-2 right-2 text-lg font-bold" onClick={handleMensajeria}>X</button>
        <h1 className="text-1xl font-bold text-center">Mensajeria</h1>
        <div>
          <ul className='flex flex-col items-center'>
            {chats.map((chat: any, index: number) => (
              <li key={chat.id} className='flex flex-row justify-around items-center space-x-4'>
                <h2> ({chat.id}) Chat: {chatnames[index]}</h2>
                <button  onClick={() => handleRedirect(chat.id, userId)} className='bg-gray-500'>abrir </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Mensajeria;