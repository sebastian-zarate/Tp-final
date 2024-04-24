import { saveEdificio, getEdificioListDB } from "./Edificios.mongodb"

export type Edificio = {
    _id: number
    name: string
    cantPiedras: number
}


const edificioList: Edificio[] = [
    { 
    _id: 1,
    name: 'Torreta',
    cantPiedras: 500 
    },
    {
    _id: 2,
    name: 'Panadería',
    cantPiedras: 800 
    },
    {
    _id: 3,
    name: 'Campamento de entrenamiento',
    cantPiedras: 300 
    },
  ]
  
  export const getEdificioList = async () => {
    return getEdificioListDB();
  }
  
  export const addEdificio = async (edificio: Edificio) => {
     if (edificioList.some((p) => p._id === edificio._id)) {
      throw new Error('Edificio ya existe')
    } 
    const newEdificioDoc = await saveEdificio(edificio)
    console.log('Saved: ', newEdificioDoc)
    return edificio
  }
  
  export const deleteEdificio = async (EdificioId: number) => {
    const index = edificioList.findIndex((edif) => edif._id === EdificioId)
    if (index === -1) {
      throw new Error('Edificio no encontrado')
    }
    return edificioList
  }