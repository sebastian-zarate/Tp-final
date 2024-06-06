'use client'
import DynamicButton from "./dynamicButton";
import { redirect } from "next/navigation";
import {getCookie, getReturnByCooki, getUserByHash } from "@/services/users";
import { useEffect, useState } from "react";

function Principal() {
    // Marca este componente como un componente del lado del cliente
   // useClient();
    const [cooki, setCooki] = useState<string>("")

   async function verificarCooki() {
        //obtengo el valor de la cookie user
        const cok = await getCookie()
        setCooki(String(cok))
/*         if(cooki == "") return redirect("login") */

        await getReturnByCooki(cooki,"principal") 
    }

   useEffect(() => {  
    verificarCooki()
    const intervalId = setInterval(() => {
        //cada 5 segundos se chequea la cookie
        verificarCooki()
        console.log("comprobando cookie")
   
    }, 5000);
    return () => clearInterval(intervalId);
}, [cooki]);


    return (
        <div>
            <DynamicButton />
        </div>
    );
}


export default Principal;
