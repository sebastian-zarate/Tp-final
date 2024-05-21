
import { cookies } from "next/headers";
import DynamicButton from "./dynamicButton";
import { redirect } from "next/navigation";
<<<<<<< HEAD
import { getBoolUserExist, getUserByHash } from "@/services/users";
import { verifyJWT } from "@/helpers/jwt";
=======
import { useEffect } from "react";
import { getBoolUserExist } from "@/services/users";
<<<<<<< HEAD
>>>>>>> 868adf736af5a9557ac2bc6759ed98f2dd202148
=======
>>>>>>> 868adf736af5a9557ac2bc6759ed98f2dd202148

async function Principal() {
    // Marca este componente como un componente del lado del cliente
   // useClient();
<<<<<<< HEAD
<<<<<<< HEAD
   if(!cookies().get('user'))redirect('/login')
   let valor = cookies().get('user')?.value
   let user
/*     let hash = verifyJWT(valor)
   const user = await getUserByHash(hash) */
   if (valor) {
    let hash = verifyJWT(valor)
    user = await getUserByHash(hash)
   }
   if(!valor && user){
=======
    let valor = cookies().get('userName')?.value
    let estado = await getBoolUserExist(valor)
   if(!valor && estado){
>>>>>>> 868adf736af5a9557ac2bc6759ed98f2dd202148
=======
    let valor = cookies().get('userName')?.value
    let estado = await getBoolUserExist(valor)
   if(!valor && estado){
>>>>>>> 868adf736af5a9557ac2bc6759ed98f2dd202148
    redirect('/login')
   }
   


    return (
        <div>
            <DynamicButton />
        </div>
    );
}

export default Principal;