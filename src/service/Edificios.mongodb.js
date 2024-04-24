
//uso la base de datos Tp-final
use('Tp-final');

//guardo el edificio pasado como parámetro de entrada en la base de datos
const saveEdificio = async (edificio) => {
  return db.insert(edificio)
}
//busco el edificio en la base de datos por el id
const findEdificio = async (id) => {
  return db.findOne({id})
}
//busco el edificio en la base de datos por el nombre
const findEdificioByName = async (name) => {
  return db.findOne({name})
}
//devuelvo la lista de edificios de la base de datos
const getEdificioListDB = async () => {
  const list = await db.Edificio.find()
  return {list}
}
//elimino el edificio de la base de datos
const deleteEdificio = async (id) => {
  db.Edificio.deleteOne({"_id": id})
}

export{saveEdificio, findEdificio, findEdificioByName, getEdificioListDB, deleteEdificio}

