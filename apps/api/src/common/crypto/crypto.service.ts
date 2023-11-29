import { Injectable } from "@nestjs/common";

import { hash, compare } from "bcryptjs";

@Injectable()
export class CryptoService {

  hash(text: string) {
    return new Promise<string>((resolve) => {
      hash(text, 10, (err, hash) => {
        if (err) {
          throw err
        }
        resolve(hash)
      })
    })
  }

  compare(text: string, hash: string) {
    return new Promise<boolean>((resolve) => {
      compare(text, hash, (err, result) => {
        if (err) {
          throw err
        }
        resolve(result)
      })
    })
  }

}