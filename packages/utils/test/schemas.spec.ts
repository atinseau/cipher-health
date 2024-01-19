import { addressSchema, clientMedicalInformationSchema, informationSchema } from "../src/schemas"

const informationSchemaBase = {
  gender: 'MALE',
  firstName: 'John',
  lastName: 'Doe',
  birthDate: '1990-01-01',
  birthPlace: 'Paris',
  birthName: 'Doe',
}

const addressSchemaBase = {
  address: '1 rue de la paix',
  addressDetails: 'Batiment B',
  city: 'Paris',
  zipCode: '75000',
  country: 'France'
}

const clientMedicalInformationSchemaBase = {
  socialSecurityNumber: '201112A01826607',
  mutualInsuranceNumber: '123456789'
}

describe('Information schema', () => {

  test('Base', () => {
    const data = informationSchema.safeParse(informationSchemaBase)
    expect(data.success).toBe(true)
  })

  test('gender', () => {
    const data2 = informationSchema.safeParse({
      ...informationSchemaBase,
      gender: 'FEMALE'
    })
    expect(data2.success).toBe(true)

    const informationSchemaWithoutGender = structuredClone((({ gender, ...rest }) => rest)(informationSchemaBase))
    const data3 = informationSchema.safeParse(informationSchemaWithoutGender)
    expect(data3.success).toBe(false)
    if (!data3.success) {
      expect(data3.error.errors).toEqual(expect.arrayContaining([expect.objectContaining({ path: ['gender'] })]))
    }

    const informationSchemaWithWrongGender = structuredClone(informationSchemaBase)
    informationSchemaWithWrongGender.gender = "salut ahah je suis pas un gender"
    expect(data3.success).toBe(false)
    if (!data3.success) {
      expect(data3.error.errors).toEqual(expect.arrayContaining([expect.objectContaining({ path: ['gender'] })]))
    }
  })
  test('firstName', () => {
    const informationSchemaWithoutFirstName = structuredClone((({ firstName, ...rest }) => rest)(informationSchemaBase))
    const data4 = informationSchema.safeParse(informationSchemaWithoutFirstName)

    expect(data4.success).toBe(false)
    if (!data4.success) {
      expect(data4.error.errors).toEqual(expect.arrayContaining([expect.objectContaining({ path: ['firstName'] })]))
    }

    const informationSchemaFirstNameNull = structuredClone(informationSchemaBase)
    // @ts-ignore
    informationSchemaFirstNameNull.firstName = null

    const data5 = informationSchema.safeParse(informationSchemaFirstNameNull)
    expect(data5.success).toBe(false)
    if (!data5.success) {
      expect(data5.error.errors).toEqual(expect.arrayContaining([expect.objectContaining({ path: ['firstName'] })]))
    }

    const informationSchemaFirstNameEmptyString = structuredClone(informationSchemaBase)
    informationSchemaFirstNameEmptyString.firstName = ""

    const data6 = informationSchema.safeParse(informationSchemaFirstNameEmptyString)
    expect(data6.success).toBe(false)
    if (!data6.success) {
      expect(data6.error.errors).toEqual(expect.arrayContaining([expect.objectContaining({ path: ['firstName'] })]))
    }
  })
  test('lastName', () => {
    const informationSchemaWithoutLastName = structuredClone((({ lastName, ...rest }) => rest)(informationSchemaBase))
    const data7 = informationSchema.safeParse(informationSchemaWithoutLastName)

    expect(data7.success).toBe(false)
    if (!data7.success) {
      expect(data7.error.errors).toEqual(expect.arrayContaining([expect.objectContaining({ path: ['lastName'] })]))
    }

    const informationSchemaLastNameNull = structuredClone(informationSchemaBase)
    // @ts-ignore
    informationSchemaLastNameNull.lastName = null

    const data8 = informationSchema.safeParse(informationSchemaLastNameNull)
    expect(data8.success).toBe(false)
    if (!data8.success) {
      expect(data8.error.errors).toEqual(expect.arrayContaining([expect.objectContaining({ path: ['lastName'] })]))
    }

    const informationSchemaLastNameEmptyString = structuredClone(informationSchemaBase)
    informationSchemaLastNameEmptyString.lastName = ""

    const data9 = informationSchema.safeParse(informationSchemaLastNameEmptyString)
    expect(data9.success).toBe(false)
    if (!data9.success) {
      expect(data9.error.errors).toEqual(expect.arrayContaining([expect.objectContaining({ path: ['lastName'] })]))
    }
  })
  test('birthDate', () => {
    const informationSchemaWithoutBirthDate = structuredClone((({ birthDate, ...rest }) => rest)(informationSchemaBase))
    const data10 = informationSchema.safeParse(informationSchemaWithoutBirthDate)
    expect(data10.success).toBe(false)
    if (!data10.success) {
      expect(data10.error.errors).toEqual(expect.arrayContaining([expect.objectContaining({ path: ['birthDate'] })]))
    }

    const informationSchemaBirthDateNull = structuredClone(informationSchemaBase)
    // @ts-ignore
    informationSchemaBirthDateNull.birthDate = null
    const data11 = informationSchema.safeParse(informationSchemaBirthDateNull)
    expect(data11.success).toBe(false)
    if (!data11.success) {
      expect(data11.error.errors).toEqual(expect.arrayContaining([expect.objectContaining({ path: ['birthDate'] })]))
    }

    const informationSchemaBirthDateEmptyString = structuredClone(informationSchemaBase)
    informationSchemaBirthDateEmptyString.birthDate = ""
    const data12 = informationSchema.safeParse(informationSchemaBirthDateEmptyString)
    expect(data12.success).toBe(false)
    if (!data12.success) {
      expect(data12.error.errors).toEqual(expect.arrayContaining([expect.objectContaining({ path: ['birthDate'] })]))
    }

    const informationSchemaBirthDateWrongFormat = structuredClone(informationSchemaBase)
    informationSchemaBirthDateWrongFormat.birthDate = "qsldkqlskdlqksd"
    const data13 = informationSchema.safeParse(informationSchemaBirthDateWrongFormat)
    expect(data13.success).toBe(false)
    if (!data13.success) {
      expect(data13.error.errors).toEqual(expect.arrayContaining([expect.objectContaining({ path: ['birthDate'] })]))
    }



    const informationSchemaBirthDateMinor = structuredClone(informationSchemaBase)
    // @ts-ignore
    informationSchemaBirthDateMinor.birthDate = new Date().toISOString()
    const data14 = informationSchema.safeParse(informationSchemaBirthDateMinor)

    expect(data14.success).toBe(false)
    if (!data14.success) {
      expect(data14.error.errors).toEqual(expect.arrayContaining([expect.objectContaining({ path: ['birthDate'] })]))
    }

    const informationSchemaBirthDateMajor = structuredClone(informationSchemaBase)
    const major = new Date()
    major.setFullYear(major.getFullYear() - 18)
    major.setMonth(major.getMonth() - 1) // to be sure
    // @ts-ignore
    informationSchemaBirthDateMajor.birthDate = major.toISOString()
    const data15 = informationSchema.safeParse(informationSchemaBirthDateMajor)
    expect(data15.success).toBe(true)


    const informationSchemaBirthDateWrongDateFormat = structuredClone(informationSchemaBase)
    // @ts-ignore
    informationSchemaBirthDateWrongDateFormat.birthDate = new Date()
    const data16 = informationSchema.safeParse(informationSchemaBirthDateWrongFormat)
    expect(data16.success).toBe(false)
    if (!data16.success) {
      expect(data16.error.errors).toEqual(expect.arrayContaining([expect.objectContaining({ path: ['birthDate'] })]))
    }

    const informationSchemaBirthDateReturnString = structuredClone(informationSchemaBase)
    const major2 = new Date()
    major2.setFullYear(major2.getFullYear() - 18)
    major2.setMonth(major2.getMonth() - 1) // to be sure

    // @ts-ignore
    informationSchemaBirthDateReturnString.birthDate = major2.toISOString()
    const data17 = informationSchema.safeParse(informationSchemaBirthDateReturnString)

    expect(data17.success).toBe(true)
    if (data17.success) {
      expect(data17.data.birthDate).toBe(major2.toISOString())
    }

  })
  test('birthPlace', () => {
    const informationSchemaWithoutBirthPlace = structuredClone((({ birthPlace, ...rest }) => rest)(informationSchemaBase))
    const data17 = informationSchema.safeParse(informationSchemaWithoutBirthPlace)
    expect(data17.success).toBe(false)
    if (!data17.success) {
      expect(data17.error.errors).toEqual(expect.arrayContaining([expect.objectContaining({ path: ['birthPlace'] })]))
    }

    const informationSchemaBirthPlaceNull = structuredClone(informationSchemaBase)
    // @ts-ignore
    informationSchemaBirthPlaceNull.birthPlace = null
    const data18 = informationSchema.safeParse(informationSchemaBirthPlaceNull)
    expect(data18.success).toBe(false)
    if (!data18.success) {
      expect(data18.error.errors).toEqual(expect.arrayContaining([expect.objectContaining({ path: ['birthPlace'] })]))
    }

    const informationSchemaBirthPlaceEmptyString = structuredClone(informationSchemaBase)
    informationSchemaBirthPlaceEmptyString.birthPlace = ""
    const data19 = informationSchema.safeParse(informationSchemaBirthPlaceEmptyString)
    expect(data19.success).toBe(false) // expect minimal length to be 1
    if (!data19.success) {
      expect(data19.error.errors).toEqual(expect.arrayContaining([expect.objectContaining({ path: ['birthPlace'] })]))
    }
  })
  test('birthName', () => {
    const informationSchemaWithoutBirthName = structuredClone((({ birthName, ...rest }) => rest)(informationSchemaBase))
    const data20 = informationSchema.safeParse(informationSchemaWithoutBirthName)
    expect(data20.success).toBe(true)

    const informationSchemaBirthNameNull = structuredClone(informationSchemaBase)
    // @ts-ignore
    informationSchemaBirthNameNull.birthName = null
    const data21 = informationSchema.safeParse(informationSchemaBirthNameNull)
    expect(data21.success).toBe(true)

    const informationSchemaBirthNameEmptyString = structuredClone(informationSchemaBase)
    informationSchemaBirthNameEmptyString.birthName = ""
    const data22 = informationSchema.safeParse(informationSchemaBirthNameEmptyString)
    expect(data22.success).toBe(true)
  })
})

describe('Address schema', () => {

  test('Base', () => {
    const data = addressSchema.safeParse(addressSchemaBase)
    expect(data.success).toBe(true)
  })

  test('address', () => {
    const addressSchemaWithoutAddress = structuredClone((({ address, ...rest }) => rest)(addressSchemaBase))
    const data23 = addressSchema.safeParse(addressSchemaWithoutAddress)
    expect(data23.success).toBe(false)
    if (!data23.success) {
      expect(data23.error.errors).toEqual(expect.arrayContaining([expect.objectContaining({ path: ['address'] })]))
    }

    const addressSchemaAddressNull = structuredClone(addressSchemaBase)
    // @ts-ignore
    addressSchemaAddressNull.address = null
    const data24 = addressSchema.safeParse(addressSchemaAddressNull)
    expect(data24.success).toBe(false)
    if (!data24.success) {
      expect(data24.error.errors).toEqual(expect.arrayContaining([expect.objectContaining({ path: ['address'] })]))
    }

    const addressSchemaAddressEmptyString = structuredClone(addressSchemaBase)
    addressSchemaAddressEmptyString.address = ""
    const data25 = addressSchema.safeParse(addressSchemaAddressEmptyString)
    expect(data25.success).toBe(false)
    if (!data25.success) {
      expect(data25.error.errors).toEqual(expect.arrayContaining([expect.objectContaining({ path: ['address'] })]))
    }
  })

  test('zipCode', () => {
    const addressSchemaWithoutZipCode = structuredClone((({ zipCode, ...rest }) => rest)(addressSchemaBase))
    const data26 = addressSchema.safeParse(addressSchemaWithoutZipCode)
    expect(data26.success).toBe(false)
    if (!data26.success) {
      expect(data26.error.errors).toEqual(expect.arrayContaining([expect.objectContaining({ path: ['zipCode'] })]))
    }

    const addressSchemaZipCodeNull = structuredClone(addressSchemaBase)
    // @ts-ignore
    addressSchemaZipCodeNull.zipCode = null
    const data27 = addressSchema.safeParse(addressSchemaZipCodeNull)
    expect(data27.success).toBe(false)
    if (!data27.success) {
      expect(data27.error.errors).toEqual(expect.arrayContaining([expect.objectContaining({ path: ['zipCode'] })]))
    }

    const addressSchemaZipCodeEmptyString = structuredClone(addressSchemaBase)
    addressSchemaZipCodeEmptyString.zipCode = ""
    const data28 = addressSchema.safeParse(addressSchemaZipCodeEmptyString)
    expect(data28.success).toBe(false)
    if (!data28.success) {
      expect(data28.error.errors).toEqual(expect.arrayContaining([expect.objectContaining({ path: ['zipCode'] })]))
    }

    const addressSchemaZipCodeWrongFormat = structuredClone(addressSchemaBase)
    addressSchemaZipCodeWrongFormat.zipCode = "qsldkqlskdlqksd"
    const data29 = addressSchema.safeParse(addressSchemaZipCodeWrongFormat)
    expect(data29.success).toBe(false)
    if (!data29.success) {
      expect(data29.error.errors).toEqual(expect.arrayContaining([expect.objectContaining({ path: ['zipCode'] })]))
    }

    const addressSchemaZipCodeWrongFormat2 = structuredClone(addressSchemaBase)
    addressSchemaZipCodeWrongFormat2.zipCode = "7500"
    const data30 = addressSchema.safeParse(addressSchemaZipCodeWrongFormat2)
    expect(data30.success).toBe(false)
    if (!data30.success) {
      expect(data30.error.errors).toEqual(expect.arrayContaining([expect.objectContaining({ path: ['zipCode'] })]))
    }
  })

  test('addressDetails', () => {
    const addressSchemaWithoutAddressDetails = structuredClone((({ addressDetails, ...rest }) => rest)(addressSchemaBase))
    const data31 = addressSchema.safeParse(addressSchemaWithoutAddressDetails)
    expect(data31.success).toBe(true)

    const addressSchemaAddressDetailsNull = structuredClone(addressSchemaBase)
    // @ts-ignore
    addressSchemaAddressDetailsNull.addressDetails = null
    const data32 = addressSchema.safeParse(addressSchemaAddressDetailsNull)
    expect(data32.success).toBe(true)

    const addressSchemaAddressDetailsEmptyString = structuredClone(addressSchemaBase)
    addressSchemaAddressDetailsEmptyString.addressDetails = ""
    const data33 = addressSchema.safeParse(addressSchemaAddressDetailsEmptyString)
    expect(data33.success).toBe(true)
  })

  test('city', () => {
    const addressSchemaWithoutCity = structuredClone((({ city, ...rest }) => rest)(addressSchemaBase))
    const data34 = addressSchema.safeParse(addressSchemaWithoutCity)
    expect(data34.success).toBe(false)
    if (!data34.success) {
      expect(data34.error.errors).toEqual(expect.arrayContaining([expect.objectContaining({ path: ['city'] })]))
    }

    const addressSchemaCityNull = structuredClone(addressSchemaBase)
    // @ts-ignore
    addressSchemaCityNull.city = null
    const data35 = addressSchema.safeParse(addressSchemaCityNull)
    expect(data35.success).toBe(false)
    if (!data35.success) {
      expect(data35.error.errors).toEqual(expect.arrayContaining([expect.objectContaining({ path: ['city'] })]))
    }

    const addressSchemaCityEmptyString = structuredClone(addressSchemaBase)
    addressSchemaCityEmptyString.city = ""
    const data36 = addressSchema.safeParse(addressSchemaCityEmptyString)
    expect(data36.success).toBe(false)
    if (!data36.success) {
      expect(data36.error.errors).toEqual(expect.arrayContaining([expect.objectContaining({ path: ['city'] })]))
    }
  })

  test('country', () => {
    const addressSchemaWithoutCountry = structuredClone((({ country, ...rest }) => rest)(addressSchemaBase))
    const data37 = addressSchema.safeParse(addressSchemaWithoutCountry)
    expect(data37.success).toBe(false)
    if (!data37.success) {
      expect(data37.error.errors).toEqual(expect.arrayContaining([expect.objectContaining({ path: ['country'] })]))
    }

    const addressSchemaCountryNull = structuredClone(addressSchemaBase)
    // @ts-ignore
    addressSchemaCountryNull.country = null
    const data38 = addressSchema.safeParse(addressSchemaCountryNull)
    expect(data38.success).toBe(false)
    if (!data38.success) {
      expect(data38.error.errors).toEqual(expect.arrayContaining([expect.objectContaining({ path: ['country'] })]))
    }

    const addressSchemaCountryEmptyString = structuredClone(addressSchemaBase)
    addressSchemaCountryEmptyString.country = ""
    const data39 = addressSchema.safeParse(addressSchemaCountryEmptyString)
    expect(data39.success).toBe(false)
    if (!data39.success) {
      expect(data39.error.errors).toEqual(expect.arrayContaining([expect.objectContaining({ path: ['country'] })]))
    }
  })
})

describe('clientMedicalInformationSchema', () => {

  test('Base', () => {
    const data = clientMedicalInformationSchema.safeParse(clientMedicalInformationSchemaBase)
    expect(data.success).toBe(true)
  })

  test('Social security number', () => {
    const clientMedicalInformationSchemaWithoutSocialSecurityNumber = structuredClone((({ socialSecurityNumber, ...rest }) => rest)(clientMedicalInformationSchemaBase))
    const data40 = clientMedicalInformationSchema.safeParse(clientMedicalInformationSchemaWithoutSocialSecurityNumber)
    expect(data40.success).toBe(true)

    const clientMedicalInformationSchemaSocialSecurityNumberNull = structuredClone(clientMedicalInformationSchemaBase)
    // @ts-ignore
    clientMedicalInformationSchemaSocialSecurityNumberNull.socialSecurityNumber = null
    const data41 = clientMedicalInformationSchema.safeParse(clientMedicalInformationSchemaSocialSecurityNumberNull)
    expect(data41.success).toBe(true)

    const clientMedicalInformationSchemaSocialSecurityNumberEmptyString = structuredClone(clientMedicalInformationSchemaBase)
    clientMedicalInformationSchemaSocialSecurityNumberEmptyString.socialSecurityNumber = ""
    const data42 = clientMedicalInformationSchema.safeParse(clientMedicalInformationSchemaSocialSecurityNumberEmptyString)
    expect(data42.success).toBe(true)

    const clientMedicalInformationSchemaSocialSecurityNumberWrongFormat = structuredClone(clientMedicalInformationSchemaBase)
    clientMedicalInformationSchemaSocialSecurityNumberWrongFormat.socialSecurityNumber = "qsldkqlskdlqksd"
    const data43 = clientMedicalInformationSchema.safeParse(clientMedicalInformationSchemaSocialSecurityNumberWrongFormat)
    expect(data43.success).toBe(false)
    if (!data43.success) {
      expect(data43.error.errors).toEqual(expect.arrayContaining([expect.objectContaining({ path: ['socialSecurityNumber'] })]))
    }

    const clientMedicalInformationSchemaSocialSecurityNumberGoodFormat = structuredClone(clientMedicalInformationSchemaBase)
    clientMedicalInformationSchemaSocialSecurityNumberGoodFormat.socialSecurityNumber = "101112B01826607"
    const data44 = clientMedicalInformationSchema.safeParse(clientMedicalInformationSchemaSocialSecurityNumberGoodFormat)
    expect(data44.success).toBe(true)
  })

})