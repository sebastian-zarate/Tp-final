import {MongoClient} from 'mongodb';

const URI = process.env.MONODB_URI;     /* Identificador del recurso */
const options = {};

if(!URI) throw new Error('Please add your Mongo');

let client = new MongoClient(URI,options);
let clientPromise;

if(process.env.NODE_ENV != 'production') {
    if(!global._mongoClientPromise){
        global._mongoClientPromise = client.connect();      /* Mientras que el cliente no este conectado a la db */
    }

    clientPromise = global._mongoClientPromise;
} else {
    clientPromise = client.connect();
}
export default clientPromise;