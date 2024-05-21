'use server'
import { PrismaClient } from "@prisma/client"

import { getSalt, hashPassword } from "../helpers/hashPassword";
import { cookies } from "next/headers";
import { signJWT } from "@/helpers/jwt";

const prisma = new PrismaClient()
let cantMadera = 500
let cantPan = 800
<<<<<<< HEAD
let cantPiedra= 600
let unidadesDeTrabajo = 100
=======
let cantPiedra = 600
>>>>>>> 2d119dee6fae267371d70084e02ff706d81f42ff

export async function createUser(user: { email: string, password: string, username: string}) {
  if (!user.email || user.email.length < 5 || !user.email.includes('@') ) {
    throw new Error('Invalid email');
<<<<<<< HEAD
  }
  if (!user.username || user.username.length < 3){
    throw new Error('Invalid username');
=======

>>>>>>> 2d119dee6fae267371d70084e02ff706d81f42ff
  }
  const existing = await prisma.users.findFirst({
    where: {
      email: user.email
    }
  })
  if (existing) {
    throw new Error('User already exists');
  }
  const existingUsername = await prisma.users.findFirst({
    where: {
      username: user.username
      }
  })
  if (existingUsername) {
    throw new Error('Username already exists');
  }

  if (!user.password || user.password.length < 8) {
    throw new Error('Password too short');
  }

  const salt = getSalt();

<<<<<<< HEAD
  const  userWithHash = {
    username: user.username,
=======
  const userWithHash = {
    username: null,
>>>>>>> 2d119dee6fae267371d70084e02ff706d81f42ff
    email: user.email,
    hash: hashPassword(salt + user.password),
    piedra: cantPiedra,
    pan: cantPan,
    madera: cantMadera,
<<<<<<< HEAD
    nivel:1, 
    salt,
    unidadesDeTrabajo
}
=======
    nivel: 1,
    salt: salt
  }
>>>>>>> 2d119dee6fae267371d70084e02ff706d81f42ff

  await prisma.users.create({ data: userWithHash });
}

export async function authenticateUser(user: {username:string, email: string, password: string }) {

  const existing = await prisma.users.findFirst({
    where: {
      email: user.email
    }
  })
  if (!existing) {
    throw new Error('User not found');
  }
  const hash = hashPassword(existing.salt + user.password);
  console.log("el hash nuevo: ", hash)
  console.log("el hash existente: ", existing.hash)
  if (hash !== existing.hash) {
    throw new Error('Invalid password');
  }
<<<<<<< HEAD
  
  cookies().set("user" , signJWT(hash) , { httpOnly: true, sameSite: 'strict' })
  cookies().set("userName" , user.username , { httpOnly: true, sameSite: 'strict' })
  /* cookies().set("userName" , user.email , { httpOnly: true, sameSite: 'strict' }) */
/*   if(user.email){
    cookies().set(user.email, signJWT(hash) , { httpOnly: true, sameSite: 'strict' })
  } 
  if(user.username){
    cookies().set(user.username, signJWT(hash) , { httpOnly: true, sameSite: 'strict' })
  }
 */
 

  return { email: existing.email, username: existing.username };
}


export const getUserByUserName = async (userName:string) => {
  const users = await prisma.users.findFirst({
    where: {
      username: userName
    }
  })        
  return users
}
export const getUserByemail = async (email:string) => {
  const users = await prisma.users.findFirst({
    where: {
      email: email
    }
  })   
   return users
}
//método que me devuelve un booleano de si existe el usuario
export const getBoolUserExist = async (email:string) => {
  const users = await prisma.users.findFirst({
    where: {
      email: email
    }
  })  
  if(users)  return true
  else return false    
}

export const updateUnidAtaqUser =async (id:string, data: any) => {
  const users = await prisma.users.update({
    where: {
      id: id
    },
    data: {
      unidadesDeAtaque: data
    }
  })
  return users
}
export const updateUnidDefUser =async (id:string, data: any) => {
  const users = await prisma.users.update({
    where: {
      id: id
    },
    data: {
      unidadesDeDefensa: data
    }
  })
  return users
=======
  cookies().set('user', signJWT(hash), { httpOnly: true, sameSite: 'strict' })
  return { email: existing.email };
>>>>>>> 2d119dee6fae267371d70084e02ff706d81f42ff
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

export async function updateUser(Id: string, data: any) {
  const u = await prisma.users.update({
    where: {
      id: Id
    },
    data: data
  })
  console.log(`User ${Id} updated: `, u)
  return u
<<<<<<< HEAD
}
=======
}
>>>>>>> 2d119dee6fae267371d70084e02ff706d81f42ff
