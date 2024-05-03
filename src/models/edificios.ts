import { Schema, model, models } from "mongoose"

const TorretasSchema = new Schema({
    id: {
        type: Number,
        unique: true,
        required:[true, "id is required"]
/*         match: [      //sirve para validar, ejemplo si va a tener una arroba
           
        ] */

    },
    nivelEdif: {
        type: Number,
        required: [true, "level is required"], //si no viene q envia un mensaje q la contra es requerida.,
      /*   select:false   */      //no es necesario que se devuelva el password
    },
    name: {
        type: String,
        required: [true, "name is required"],
        minLength: [3, "Fullname must be at least 3 characters"],
        maxLength: [50, "Fullname must be at least 3 characters"]
    }
})

//me permite interactuar con la base de datos, buscar, eliminar
//si models.user ya existe en la db tomarlo, sino crealo
const Torretas =models.Torretas || model('Torretas', TorretasSchema)
export default Torretas