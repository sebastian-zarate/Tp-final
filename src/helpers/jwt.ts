import jwt from 'jsonwebtoken'

const secret = "mysecret"

export const signJWT = (payload: any) => {
   return jwt.sign(payload, secret)
}

export const verifyJWT = (token: any) => {
  return  jwt.verify(token, secret)

}

