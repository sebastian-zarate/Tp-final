/* "use client"                         //cliente_componente_asi lo ejecuto desde el cliente_ front-end 
import { useEffect } from "react";

export default function Home() {

  useEffect(() => {
    fetch('/api/edificios')
    .then(res => res.json())
    .then(data => console.log(data))
  }, [])
 */

  //asi desde el server back_end
/* import {connectDB} from '@/lib/mongodb'
import Edificio from "@/models/edificios";

async function loadEdificios(){
  await connectDB()

  const edificios = await Edificio.find()
  return edificios
}
 */

export default async function Home() {

 /*  const edificios = await loadEdificios() */
  return (
  <div>
    {/* JSON.stringfy(users) */}
    {/* <h1>Edificios</h1> */}
  </div>
  )
}
