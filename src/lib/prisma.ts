import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {

    const torretas = await prisma.torretas.create({
        data:{
            name: 'Cañon',
            nivel: 0         
        }
    })
    return torretas

}
export default main()