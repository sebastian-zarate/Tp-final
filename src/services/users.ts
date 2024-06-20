'use server'
import { PrismaClient } from "@prisma/client"

import { getSalt, hashPassword } from "../helpers/hashPassword";
import { cookies } from "next/headers";
import { signJWT, verifyJWT } from "@/helpers/jwt";
import { StyledString } from "next/dist/build/swc";
import { error } from "console";
import { redirect } from "next/navigation";
import { emailExist, emailShort, passwordInvalid, passwordShort, recurInsuf, recurNegat, userExist, usernameExist, usernamelLong, usernameShort, userSinMad, userSinPan, userSinPied } from "@/helpers/error";

const prisma = new PrismaClient()
let cantMadera = 500
let cantPan = 800
let cantPiedra = 600
let unidadesDeTrabajo = 100

export async function createUser(user: { email: string, password: string, username: string, profileImage: string }) {
  if (user.email.length < 5) {
    throw new Error(emailShort);
  }
  if (user.username.length < 3) {
    throw new Error(usernameShort);
  }
  if (user.username.length > 30) {
    throw new Error(usernamelLong);
  }
  const existing = await prisma.users.findFirst({
    where: {
      email: user.email
    }
  })
  if (existing) {
    throw new Error(emailExist);
  }
  const existingUsername = await prisma.users.findFirst({
    where: {
      username: user.username
    }
  })
  if (existingUsername) {
    throw new Error(usernameExist);
  }

  if (user.password.length < 8) {
    throw new Error(passwordShort);
  }


  const salt = getSalt();

  const userWithHash = {
    username: user.username,
    email: user.email,
    hash: hashPassword(salt + user.password),
    profileImage: user.profileImage,
    piedra: cantPiedra,
    pan: cantPan,
    madera: cantMadera,
    nivel: 1,
    salt,
    unidadesDeTrabajo: unidadesDeTrabajo,
  }

  const createdUser = await prisma.users.create({ data: userWithHash });
  //region Edificios iniciales

  // Crear el ayunta para el usuario
  await prisma.userEdificios.create({
    data: {

      // Agrega otros campos necesarios para el edificio aquí
      edificioId: '663ac05f044ccf6167cf703d', // Asegúrate de que este es un string válido
      posicion_x: 400,
      posicion_y: 400,
      userId: createdUser.id,
      ultimaInteraccion: new Date(),
      nivel: 1,
    }
  });
  // Crear cantera para el usuario
  await prisma.userEdificios.create({
    data: {

      // Agrega otros campos necesarios para el edificio aquí
      edificioId: '663ac05f044ccf6167cf7040', // Asegúrate de que este es un string válido
      posicion_x: 200,
      posicion_y: 400,
      userId: createdUser.id,
      ultimaInteraccion: new Date(),
      nivel: 1,
    }
  });
  // Crear maderera para el usuario
  await prisma.userEdificios.create({
    data: {

      // Agrega otros campos necesarios para el edificio aquí
      edificioId: '663ac05f044ccf6167cf7041', // Asegúrate de que este es un string válido
      posicion_x: 600,
      posicion_y: 400,
      userId: createdUser.id,
      ultimaInteraccion: new Date(),
      nivel: 1,
    }
  });
}

export async function authenticateUser(user: { dataUser: string, password: string }) {

  let userTemp;
  let existing = await prisma.users.findFirst({
    where: {
      email: user.dataUser,
    }
  })

  if (existing) userTemp = existing

  if (!existing) {
    let existing2 = await prisma.users.findFirst({
      where: {
        username: user.dataUser
      }
    })
    if (existing2) userTemp = existing2
    if (!existing2) {
      throw new Error(userExist);
    }
  }

  const hash = hashPassword(userTemp?.salt + user.password);
  console.log(`hash nuevo: ${hash} - signJWT: ${signJWT(hash)}`)
  console.log(`hash existente: ${userTemp?.hash} - signJWT: ${signJWT(userTemp?.hash)}`)

  if (hash !== userTemp?.hash) {
    throw new Error(passwordInvalid);
  }

  cookies().set("user", signJWT(hash), { httpOnly: true, sameSite: 'strict' })

  return { userTemp };
}


export const getUserByUserName = async (userName: string) => {
  const users = await prisma.users.findFirst({
    where: {
      username: userName
    }
  })
  return users
}

export const getUserByemail = async (email: string) => {
  const users = await prisma.users.findFirst({
    where: {
      email: email
    }
  })
  return users
}
export const getUserByHash = async (hash?: string) => {
  const users = await prisma.users.findFirst({
    where: {
      hash: hash
    }
  })
  if (users) return users
  /* else return false   */
}
export const getUserById = async (Id: string) => {
  const users = await prisma.users.findFirst({
    where: {
      id: Id
    }
  })
  return users
  /* else return false   */
}
export async function getUser(Id: string) {
  const u = await prisma.users.findUnique({
    where: {
      id: Id
    }
  })
  console.log(`User ${Id}: `, u)
  return u
}

//devuelve todos los username 
export async function getAllUser() {
  const users = await prisma.users.findMany({})
  return users
}

//actualizo user
export async function updateUser(Id: string, data: any) {
  const u = await prisma.users.update({
    where: {
      id: Id
    },
    data: data
  })
  console.log(`User ${Id} updated: `, u)
  return u
}
//region cambios Nico 
//MENSAJERIA
export async function updateUserRecursos(idEmisor: string, usernameReceptor: string, madera: number, piedra: number, pan: number) {
  //consigo el id del usuario
  let u = await getUserById(idEmisor)
  //si la madera o la piedra o el pan que se quieran regalar son mayores en cantidad a los que posee el usuario, negar la acción
  if ((Number(u?.madera) < madera)) {
    throw new Error(userSinMad)
  }
  if (Number(u?.piedra) < piedra) {
    throw new Error(userSinPied)
  }
  if (Number(u?.pan) < pan) {
    throw new Error(userSinPan)
  }

  //lógica para restar recursos al emisor
  let maderaUpdated = Number(u?.madera) - madera
  let piedraUpdated = Number(u?.piedra) - piedra
  let panUpdated = Number(u?.pan) - pan
  //si el usuariio quiere donar más recuros de los que puede
  if (maderaUpdated < 0) {
    throw new Error(userSinMad)
  }
  if (piedraUpdated < 0) {
    throw new Error(userSinPied)
  }
  if (panUpdated < 0) {
    throw new Error(userSinPan)
  }
  //actualizo al emisor del mensaje
  const emisorUpdated = await prisma.users.update({
    where: {
      id: idEmisor
    },
    data: {
      madera: maderaUpdated,
      piedra: piedraUpdated,
      pan: panUpdated
    }
  })
  console.log(`se actualizooooo a ${u?.username} `, emisorUpdated)

  //lógica para sumar recursos al receptor
  u = await getUserByUserName(usernameReceptor)
  let maderaReceptorUpdate = Number(u?.madera) + madera
  let piedraReceptorUpdate = Number(u?.piedra) + piedra
  let panReceptorUpdate = Number(u?.pan) + pan
  //actualizo al receptor del mensaje
  const receptorUpdated = await prisma.users.update({
    where: {
      username: usernameReceptor
    },
    data: {
      madera: maderaReceptorUpdate,
      piedra: piedraReceptorUpdate,
      pan: panReceptorUpdate
    }
  })
  console.log(`se actualizoooooo a ${u?.username} `, receptorUpdated)
  return receptorUpdated
}


// Devuelve el user en base a la cookie
export async function getUserByCooki() {
  //obtengo el valor de la cookie user
  const cooki = cookies().get('user')?.value
  //se obtiene el hash de traducir el token
  let hash = verifyJWT(String(cooki))
  //se obtiene el user por el hash
  const user = await getUserByHash(String(hash))
  return user
}
//devuelve a una página en base de la cooki
export async function getReturnByCooki() {
  let cooki = cookies().get('user')?.value
  //se obtiene el hash de traducir el token
  if (!cooki) return redirect('login')
  let hash = verifyJWT(cooki)
  //se obtiene el user por el hash
  const user = await getUserByHash(String(hash))
  if (!user) return redirect('login')
}

export const removeCookie = async () => {
  const cookie = cookies().delete('user'); // ctx es el contexto de la solicitud (por ejemplo, getServerSideProps)
  return cookie
};

export async function updateLevelUser(userId: string, madera: number, piedra: number, pan: number) {
  const U = await getUserById(userId)



  const costoNivel1 = 5000
  const costoNivel2 = 8000
  const costoNivel3 = 12000

  const levelUser = Number(U?.nivel);
  let levelUpdated = levelUser + 1
  let maderaUser = Number(U?.madera);
  let piedraUser = Number(U?.piedra);
  let panUser = Number(U?.pan);

  let userUpdated;
  if ((levelUser == 1) && (maderaUser >= costoNivel1 && piedraUser >= costoNivel1 && panUser >= costoNivel1)) {
    //actualizo recuros de user
    maderaUser -= costoNivel1
    piedraUser -= costoNivel1
    panUser -= costoNivel1
    console.log("madera actualizada:", maderaUser)

    await prisma.users.update({
      where: {
        id: userId
      },
      data: {
        nivel: levelUpdated,
        madera: maderaUser,
        piedra: piedraUser,
        pan: panUser
      }
    })
    return costoNivel1
  }
  else if ((levelUser == 2) && ((maderaUser && piedraUser && panUser) >= costoNivel2)) {
    //actualizo recuros de user
    maderaUser -= costoNivel2
    piedraUser -= costoNivel2
    panUser -= costoNivel2

    await prisma.users.update({
      where: {
        id: String(userId)
      },
      data: {
        nivel: levelUpdated
      }
    })
    return costoNivel2

  } else if ((levelUser == 3) && ((maderaUser && piedraUser && panUser) >= costoNivel3)) {
    //actualizo recuros de user
    maderaUser -= costoNivel3
    piedraUser -= costoNivel3
    panUser -= costoNivel3
    userUpdated = await prisma.users.update({
      where: {
        id: String(userId)
      },
      data: {
        nivel: levelUpdated
      }
    })
    return costoNivel3

  } else {
    throw new Error(recurInsuf)
  }

}
//region hasta aca Nico



export async function updateUserRecursosPropios(Id: string, madera: number, piedra: number, pan: number) {
  const u = await getUserById(Id)
  if ((Number(u?.madera) < madera) || (Number(u?.piedra) < piedra)
    || (Number(u?.pan) < pan)) {
    throw error("Insuficientes recursos")
  }
  let maderaUpdated = Number(u?.madera) - madera
  let piedraUpdated = Number(u?.piedra) - piedra
  let panUpdated = Number(u?.pan) - pan

  const userUpdated = await prisma.users.update({
    where: {
      id: Id
    },
    data: {
      madera: maderaUpdated,
      piedra: piedraUpdated,
      pan: panUpdated
    }
  })

  console.log(`User ${Id} updated: `, userUpdated)
  return userUpdated
}

