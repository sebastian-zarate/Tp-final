import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {

    //aca se crean las colecciones para la base de datos
/*     const torretas = await prisma.torretas.create({
        data:{
            name: 'Cañon',
            nivel: 0         
        }
    })
    const ayunta = await prisma.ayuntamiento.create({
        data:{
            name: 'Ayuntamiento',
            nivel: 0
        }
    })
    const muros = await prisma.muros.create({
        data:{
            name: 'Muros',
            nivel: 0
        }
    })
    const herreria = await prisma.herreria.create({
        data:{
            name: 'Herrería',
            nivel: 0,
            maderaNecesaria: 200,
            piedraNecesaria: 100
        }
    })
    const cantera = await prisma.cantera.create({
        data:{
            name: 'Cantera',
            nivel: 0,
            nivelHerriaNecesario: 0
        }
    })
    const maderera = await prisma.maderera.create({
        data:{
            name: 'Maderera',
            nivel: 0,
            maderaNecesaria: 200, 
            piedraNecesaria: 100  
        }
    })
    const bosque = await prisma.bosque.create({
        data:{
            name: 'Bosque',
            nivel: 0,
            nivelMadereraNecesario: 0
        }
    })
    const arr = [torretas, ayunta,muros, herreria, cantera, maderera, bosque] 
    return arr */

}
export default main()