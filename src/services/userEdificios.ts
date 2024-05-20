'use server'
import { PrismaClient } from "@prisma/client";



const prisma = new PrismaClient();


export async function getUser(user?: string) {
   const userId = user;
    return userId;

}

export async function GuardarEdificio(id: string, posX: number, posY: number): Promise<void> {
    //id = '663ac05f044ccf6167cf703d'

    console.log("id ", id)
    console.log(" posx", posX)
    console.log(posY)
    try {
      // Lógica para guardar/actualizar el edificio en la base de datos
      await prisma.userEdificios.update({
        where: { id },
        data: {
        userId: '6645239328fab0b97120439e',
          posicion_x: posX,
          posicion_y: posY,
         
        },
       
      });
    } catch (error) {
      console.error("Error saving building:", error);
      throw error;
    }
    console.log("id ", id)
    console.log(" posx", posX)
    console.log(posY)

  }


export async function builtEdificio(edificioId: string,posX: number, posY: number ): Promise<void> {
    try {
        // Lógica para crear un nuevo edificio en la base de datos
        await prisma.userEdificios.create({
            data: {
                userId: '6645239328fab0b97120439e',
                posicion_x: posX,
                posicion_y: posY,
                edificio: {
                    connect: { id: edificioId } // Conectar el edificio existente por su ID
                }
            },
        });
        console.log("Edificio creado exitosamente.");
    } catch (error) {
        console.error("Error al guardar el edificio:", error);
        throw error;
    }
}







export async function getBuildingsByUserId(userId: string): Promise<any[]> {
    try {
        // Buscar todos los edificios creados por el usuario con el ID proporcionado
        const buildings = await prisma.userEdificios.findMany({
            where: {
                userId: '66468410bdff2445e9bb57d6', // Utilizar el `userId` proporcionado en la llamada
            },
            include: {
                edificio: {
                    select: {
                        id: true,
                        ancho: true,
                        largo: true,
                        name: true, // Suponiendo que 'name' es el tipo del edificio
                    }
                }
            }
        });

        // Mapeamos los resultados para que tengan el formato deseado
        return buildings.map(building => ({
            id: building.edificio.id,
            x: building.posicion_x,
            y: building.posicion_y,
            type: building.edificio.name, // Usar el nombre del edificio como tipo
            ancho: building.edificio.ancho,
            largo: building.edificio.largo
        }));
    } catch (error) {
        console.error("Error fetching buildings by user ID:", error);
        throw error;
    }
}