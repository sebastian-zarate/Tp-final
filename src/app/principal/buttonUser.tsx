import React from 'react';
import { removeCookie } from "@/services/users";
import Mensajeria from "./menuChats";
import Image from "next/image";

interface ButtonUserProps {
  userId: string;
  mostrarMensajeria: boolean;
  userLoaded: boolean;
  chats: any;
  chatnames: string[];
  handleMensajeria: () => void;
  getMensajes: (id: string) => void;
  username: string;
  profileImage: any;
  subirNivel: () => void;
  nivelUser: number;
}

class ButtonUser extends React.Component<ButtonUserProps> {
  deleteCook = async () => {
    await removeCookie();
  }


  render() {
    const { userId, username, profileImage, mostrarMensajeria, userLoaded, chats, chatnames, handleMensajeria, getMensajes, subirNivel, nivelUser } = this.props;
    return (
      <div className="px-10 py-6 my-2 items-center absolute top-16 right-3 flex flex-col rounded" style={{ backgroundColor: 'rgba(172, 122, 27, 1)', border: '2mm ridge rgba(0, 0, 0, .7)', height: "83vh" }}>
        <div>
          <h1 style={{ fontSize: 18 }} className="top-4 text-black font-stoothgart ">Foto</h1>
          <Image src={`/Images/profileImg/${profileImage}`} alt="profile" width={100} height={100} />
          <h2 style={{ fontSize: 18 }} className="flex top-8 text-black font-stoothgart ">{username}</h2>
        </div>
        <Mensajeria
          userId={userId}
          mostrarMensajeria={mostrarMensajeria}
          userLoaded={userLoaded}
          chats={chats}
          chatnames={chatnames}
          handleMensajeria={handleMensajeria}
          getMensajes={getMensajes}
        />

        <button style={{ backgroundColor: 'rgba(131, 1, 21, 255)', border: '2mm ridge rgba(0, 0, 0, .7)', fontSize: 16 }} className="flex mt-5  px-5 py-2 font-stoothgart text-yellow-500" onClick={() => subirNivel()}>Subir de nivel</button>

        <button style={{ fontSize: 18 }} className="font-stoothgart text-red-950 absolute bottom-6" onClick={() => { window.location.replace("/login"); this.deleteCook() }} >Cerrar Sesión</button>
      </div>
    );
  }
}

export default ButtonUser;