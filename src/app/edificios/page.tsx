
import { addEdificio, getEdificios } from "@/services/edificios"
import {getUEbyUserId, getUEbyUserIdEdId} from "@/services/userEdificios"
export default async function EdificiosPage() {


  const list = await getEdificios()
  //PROBAR METODOS
  const UEbyUserId = await getUEbyUserId("66468410bdff2445e9bb57d6")
  const UEbyUserIdEdId = await getUEbyUserIdEdId("66468410bdff2445e9bb57d6", "663ac05f044ccf6167cf7040")
/*   const [count, setCount] = useState(0) */
/*   const [page, setPage] = useState(1)
  const [count, setCount] = useState(0) */
/*   const pageCount = Math.ceil(count / 5) */



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

  

  return (
    <main className="container mx-auto flex flex-col pt-10 bg-white">
		<h1 className="text-5xl text-blue-600 font-extrabold text-center">Edificios</h1>
		<ul className="mt-4 border-4 border-black-700">
            <h1>Edificios</h1>
			<li className="flex items-center justify-between border-b border-gray-300 p-2 bg-green-700">
				<span className="text-lg text-white font-extrabold w-1/3">ID</span>
				<span className="text-lg text-white font-extrabold w-1/3 text-center">Name</span>
				
			</li>
			{list.map((e, index) => (
				<li key={index} className="flex items-center justify-between border-b border-gray-300 p-2">
					<span key={index} className=" text-sm text-black-600 font-bold w-1/3">{index + 1}</span>
					<span className="text-lg text-black-600 font-bold w-1/3 text-center">{e.name}</span>
					<div className="w-1/3 text-right">
					</div>
				</li>
			))}
            
		</ul>

	</main>
  )
}

