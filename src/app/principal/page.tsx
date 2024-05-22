"use server"
import { cookies } from "next/headers";
import DynamicButton from "./dynamicButton";
import { redirect } from "next/navigation";
import { getUserByHash } from "@/services/users";
import { verifyJWT } from "@/helpers/jwt";

async function Principal() {
    // Marca este componente como un componente del lado del cliente
   // useClient();
  
   const cooki = cookies().get('user')?.value
/*    console.log("cokieessssssssssssssssss",cooki) */
   if(!cooki) redirect("/login")
   let valor = cooki
   let user;
   if (valor) {
       let hash = verifyJWT(valor)
       user = await getUserByHash(hash)

   }
   if(!valor && user){
    redirect('/login')
   }

    return (
        <div>
            <DynamicButton />
        </div>
    );
}


export default Principal;
