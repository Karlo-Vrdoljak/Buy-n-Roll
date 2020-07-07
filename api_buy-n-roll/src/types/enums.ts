export enum SellerType {
  PRIVATNA_OSOBA = 'PRIVATNA_OSOBA',
  PODUZECE = 'PODUZECE'
}

export enum VehicleState {
  IZVRSNO = "IZVRSNO",
  UREDNO = "UREDNO",
  DOBRO = "DOBRO",
  RABLJENO = "RABLJENO",
  LOSIJE = "LOSIJE",
  DIJELOVI = "DIJELOVI",
  LOSE = "LOSE",
  KARAMBOLIRAN = "KARAMBOLIRAN"
}

export enum PaymentMethod {
  GOTOVINA = "GOTOVINA",
  KARTICNO = "KARTICNO",
  NA_RATE = "NA_RATE",
  ZAMJENA = "ZAMJENA"
}

export enum ErrorMessages {
  userNotFound = 'BUYNROLL_ERR_USER_NOT_FOUND',
  wrongPassword = 'BUYNROLL_ERR_WRONG_PASSWORD',
}