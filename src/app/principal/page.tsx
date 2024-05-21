
import { cookies } from "next/headers";
import DynamicButton from "./dynamicButton";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { getBoolUserExist } from "@/services/users";

async function Principal() {
    // Marca este componente como un componente del lado del cliente
   // useClient();
    let valor = cookies().get('userName')?.value
    let estado = await getBoolUserExist(valor)
   if(!valor && estado){
    redirect('/login')
   }

    return (
        <div>
            <DynamicButton />
        </div>
    );
}

export default Principal;