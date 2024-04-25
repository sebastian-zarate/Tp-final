const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://franciscogirard:nicolaslodei10@cluster0.mongodb.net/Tp-final?retryWrites=true&w=majority";
const client = new MongoClient(uri);
const collection = client.db("Tp-final").collection("Edificios");

const saveEdificio = async (edificio) => {
  const result =  await collection.insertOne(edificio);
  return result;
}

const findEdificio = async (id) => {
  const edificio =  await collection.findOne({ _id: id });
  console.log(edificio)
  return edificio;
}

const findEdificioByName = async (name) => {
  const edificio = await collection.findOne({ name });
  return edificio;
}

const getEdificioListDB = async () => {
  const list = await collection.find().toArray();
  return list;
}

module.exports = { saveEdificio, findEdificio, findEdificioByName, getEdificioListDB };
