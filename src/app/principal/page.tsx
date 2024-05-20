
import { cookies } from "next/headers";
import DynamicButton from "./dynamicButton";
import { redirect } from "next/navigation";


async function Principal() {
    // Marca este componente como un componente del lado del cliente
   // useClient();

   if(!cookies().get('user')){
    redirect('/login')
   }

   return (
    <div >
      <DynamicButton />
    </div>
  );
}

export default Principal;