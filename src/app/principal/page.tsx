
import { cookies } from "next/headers";
import DynamicButton from "./dynamicButton";
import { redirect } from "next/navigation";
import { getBoolUserExist, getUserByHash } from "@/services/users";
import { verifyJWT } from "@/helpers/jwt";

async function Principal() {
    // Marca este componente como un componente del lado del cliente
   // useClient();
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
    redirect('/login')
   }
   


    return (
        <div>
            <DynamicButton />
        </div>
    );
}

export default Principal;