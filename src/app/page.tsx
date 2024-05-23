import { redirect } from "next/navigation"


export default async function Home() {
      redirect("/login")
  return (
    <main className="bg-slate-400 flex justify-center items-center ">
        <div className=" bg-blue-400 flex justify-center w-40 mt-40 border-black border text-black ">
            <h1 className=" ">HOLA MUNDO</h1>
        </div>
    </main>

  )
}
