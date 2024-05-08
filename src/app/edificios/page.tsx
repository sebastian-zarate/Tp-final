'use client'

import { addEdificio, getEdificios } from "@/services/edificios"
import { useEffect, useState } from "react"
/* import { useNavigate } from "react-router-dom" */

type Edificio = {
  id: string
  name: string
  nivel: string
}


export default   function Edificios() {


  const [list, setList] = useState<Edificio[]>([])
/*   const [count, setCount] = useState(0) */
/*   const [page, setPage] = useState(1)
  const [count, setCount] = useState(0) */
/*   const pageCount = Math.ceil(count / 5) */

  useEffect(() => {
    let cancelled = false
    getEdificios()
      .then((data) => {
        if (!cancelled) {
          setList(data)
         /*  setCount(data.length) */
/*           setCount(data.count) */
        } 
      })
    
    return () => {
      cancelled = true
    }
  }, [/* page */])


  async function addEdificiO(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const data = new FormData(form)
    const edificio = {
      nivel: parseInt(data.get('nivel') as string),
      name: data.get('name') as string
    }

    await addEdificio(edificio)

    form.reset()
  /*   setList(current => [...current, edificio]) */
/*     if (page === pageCount && list.length < 5) {
      setList(current => [...current, pokemon])
    }
    setCount(current => current + 1) */
  }

  async function deleteEdif(id:string) {
    await deleteEdif(id)
/* 
    setList(current => current.filter(pokemon => pokemon.id !== id))
    setCount(current => current - 1)

    if (page >= pageCount && list.length === 1 && page > 1) {
      setPage(page - 1) */
    }
  

  return (
    <main className="container mx-auto flex flex-col pt-10 bg-white">
		<h1 className="text-5xl text-blue-600 font-extrabold text-center">Edificios</h1>
		<form action="/api/pokemon" method="post" onSubmit={addEdificiO}>
			<h2 className="text-2xl text-blue-700 font-bold">Agregar nuevo Edificio</h2>
			<input type="number" name="nivel" placeholder="nivel" className="my-1 w-full p-2 border border-gray-300 rounded-lg" />
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
						<button onClick={() => deleteEdif(e.id)} className="font-bold hover:font-extrabold">X</button>	
					</div>
				</li>
			))}
            
		</ul>

	</main>
  )
}

