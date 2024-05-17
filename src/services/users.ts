'use server'
import { PrismaClient } from "@prisma/client"

import { getSalt, hashPassword } from "../helpers/hashPassword";
import { ok } from "assert";
import { cookies } from "next/headers";
import { signJWT } from "@/helpers/jwt";

const prisma = new PrismaClient()
let cantMadera = 500
let cantPan = 800
let cantPiedra = 600

export async function createUser(user: { email: string, password: string }) {
  if (!user.email || user.email.length < 5 || !user.email.includes('@')) {
    throw new Error('Invalid email');

  }
  const existing = await prisma.users.findFirst({
    where: {
      email: user.email
    }
  })
  if (existing) {
    throw new Error('User already exists');
  }
  if (!user.password || user.password.length < 8) {
    throw new Error('Password too short');
  }

  const salt = getSalt();

  const userWithHash = {
    username: null,
    email: user.email,
    hash: hashPassword(salt + user.password),
    piedra: cantPiedra,
    pan: cantPan,
    madera: cantMadera,
    nivel: 1,
    salt: salt
  }

  await prisma.users.create({ data: userWithHash });
}

export async function authenticateUser(user: { email: string, password: string }) {

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
  cookies().set('user', signJWT(hash), { httpOnly: true, sameSite: 'strict' })
  return { email: existing.email };
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
}