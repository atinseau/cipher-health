import { CryptoService } from "@/common/crypto/crypto.service"


describe('Crypto Service', () => {

  let cryptoService: CryptoService

  beforeAll(async () => {
    cryptoService = new CryptoService()
  })

  it('should create a passphrase with 32 words', () => {
    const passphrase = cryptoService.createPassphrase()
    expect(passphrase).toBeDefined()
    const words = passphrase.split(' ')
    expect(words.length).toBe(32)
  })

  it('should symmetrically encrypt and decrypt a text', async () => {
    const passphrase = cryptoService.createPassphrase()
    const privateKey = 'supersecretkey'

    const encrypt = await cryptoService.encrypt(passphrase, privateKey)

    expect(encrypt).toBeDefined()
    expect(encrypt).not.toEqual(passphrase)

    const decrypted = await cryptoService.decrypt(encrypt, privateKey)

    expect(decrypted).toBeDefined()
    expect(decrypted.toString()).toEqual(passphrase)

    let isFailedWrongKey = false
    try {
      await cryptoService.decrypt(encrypt, 'wrongkey') // wrong key
      isFailedWrongKey = false
    } catch (e) {
      isFailedWrongKey = true
    }
    expect(isFailedWrongKey).toBe(true)


    let isFailedWrongText = false
    try {
      await cryptoService.decrypt(Buffer.from('wrongtext'), privateKey) // wrong text
      isFailedWrongText = false
    } catch (e) {
      isFailedWrongText = true
    }
    expect(isFailedWrongText).toBe(true)
  })

  it("should create a private key with custom length", () => {
    const privateKey1 = cryptoService.createPrivateKey()

    expect(privateKey1).toBeDefined()
    expect(privateKey1.length).toBe(64)

    const privateKey2 = cryptoService.createPrivateKey(32)

    expect(privateKey2).toBeDefined()
    expect(privateKey2.length).toBe(32)
  })

  it("e2e encryption profile", async () => {
    const password = "supersecretkey"
    const encryptionProfile = await cryptoService.createEncryptionProfil(password)

    const { keys, passphrase } = encryptionProfile

    expect(keys).toBeDefined()
    expect(passphrase).toBeDefined()

    const { recoveryKey, userKey } = keys

    expect(recoveryKey).toBeDefined()
    expect(userKey).toBeDefined()

    // simulate sending the passphrase to the client (encrypted with the password to prevent man in the middle attacks)
    const encryptedPassphrase = await cryptoService.encrypt(passphrase, password)

    // simulate sending the user key to the client

    // lifecycle
    // request to server -> request to db -> fetch userKey -> retreive to server -> send to client

    // to get the encryption key, you need to decrypt the userKey with the user password
    // if the user forgets his password, he can use the passphrase to decrypt the recoveryKey and get the encryption key
    // the decrypted user key will be used to encrypt the data
    const decryptedUserKey = await cryptoService.decrypt(userKey, password) // <-- normal flow

    // simulate the client decrypting the passphrase with the password and
    // using the passphrase to decrypt the recovery key and get the encryption key

    const decryptedPassphrase = await cryptoService.decrypt(encryptedPassphrase, password) // <-- if the user forgets his password flow
    const decryptedRecoveryKey = await cryptoService.decrypt(recoveryKey, decryptedPassphrase.toString())

    // check if the decrypted passphrase with the password is the same as the initial passphrase created in the encryption profile
    expect(decryptedPassphrase.toString()).toEqual(passphrase)

    // the decrypted recovery key should be the same as the decrypted user key
    expect(decryptedRecoveryKey.toString()).toEqual(decryptedUserKey.toString())
  })
})