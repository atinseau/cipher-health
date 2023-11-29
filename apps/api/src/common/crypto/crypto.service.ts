import { Injectable } from "@nestjs/common";

import { hash } from "bcryptjs";

@Injectable()
export class CryptoService {

  async hash(text: string) {
    return new Promise<string>((resolve) => {
      hash(text, 10, (err, hash) => {
        if (err) {
          throw err
        }
        resolve(hash)
      })
    })
  }

}