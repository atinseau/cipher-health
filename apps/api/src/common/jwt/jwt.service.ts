import { Injectable } from "@nestjs/common";
import { JwtPayload, SignOptions, sign, verify } from 'jsonwebtoken'

@Injectable()
export class JwtService {

  sign<Payload extends Record<string, any>>(
    payload: Payload,
    secret: string,
    options?: SignOptions
  ) {
    return new Promise<string>((resolve) => {

      const defaultOptions: SignOptions = {
        expiresIn: '1h',
        ...options
      }

      sign(payload, secret, defaultOptions, (err, token) => {
        if (err || !token) {
          throw err
        }
        resolve(token)
      })
    })
  }

  verify(token: string, secret: string) {
    return new Promise<false | string | JwtPayload>((resolve) => {
      verify(token, secret, (err, decoded) => {
        if (err || !decoded) {
          resolve(false)
          return
        }
        resolve(decoded)
      })
    })
  }

}
