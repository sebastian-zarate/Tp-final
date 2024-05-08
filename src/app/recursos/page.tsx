'use client'

import { addRecurso, getEdificios, getRecursos } from "@/services/edificios"
import { useEffect, useState } from "react"
/* import { useNavigate } from "react-router-dom" */

type Recursos = {
  name: string
  id: string
}


export default function Edificios() {

  const [list, setList] = useState<Recursos[]>([])

  useEffect(() => {
    let cancelled = false
    getRecursos()
      .then((data) => {
        if (!cancelled) {
          setList(data)
        } 
      })
    
    return () => {
      cancelled = true
    }
  }, [/* page */])


  async function addRecursO(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const data = new FormData(form)
    const edificio = {
      name: data.get('name') as string
    }

    await addRecurso(edificio)

    form.reset()

  }

  async function deleteRec(id:string) {
    await deleteRec(id)
    }
  

  return (
    <main className="container mx-auto flex flex-col pt-10 bg-white">
		<h1 className="text-5xl text-blue-600 font-extrabold text-center">Recursos</h1>
		<form action="/api/pokemon" method="post" onSubmit={addRecursO}>
			<h2 className="text-2xl text-blue-700 font-bold">Agregar nuevo Edificio</h2>
			<input type="text" name="name" placeholder="Name" className="my-1 w-full p-2 border border-gray-300 rounded-lg" />
			<button type="submit" className="w-full p-2 bg-green-500 text-white rounded-lg mt-2 font-bold uppercase duration-200 hover:bg-blue-700">Agregar</button>
		</form>
		<ul className="mt-4 border-4 border-black-700">
            <h1>Edificios</h1>
			<li className="flex items-center justify-between border-b border-gray-300 p-2 bg-green-700">
				<span className="text-lg text-white font-extrabold w-1/3">ID</span>
				<span className="text-lg text-white font-extrabold w-1/3 text-center">Name</span>
				<span className="text-lg text-white font-extrabold w-1/3 text-right">DELETE</span>
			</li>
			{list.map((e, index) => (
				<li className="flex items-center justify-between border-b border-gray-300 p-2">
					<span key={index} className=" text-sm text-black-600 font-bold w-1/3">{index + 1}</span>
					<span className="text-lg text-black-600 font-bold w-1/3 text-center">{e.name}</span>
					<div className="w-1/3 text-right">
						<button onClick={() => deleteRec(e.id)} className="font-bold hover:font-extrabold">X</button>	
					</div>
				</li>
			))}
            
		</ul>

	</main>
  )
}

