// Convention to decide if something worked or did not worke
// Since Functional error handling is handled with tupples
// Left / Right
// Fluxo do programa sempre vai para a direita, seguindo o fluxo
// Quando um erro acontece, o fluxo vai pra esquerda
// UI -> CTRl -> Use Case -> Entity -> Use Case -> Repository -> DataBase

// Error
export class Left<L, R> {
  readonly value: L

  constructor(value: L) {
    this.value = value
  }

  isRight(): this is Right<L, R> {
    return false
  }

  isLeft(): this is Left<L, R> {
    return true
  }
}

// Success
export class Right<L, R> {
  readonly value: R

  constructor(value: R) {
    this.value = value
  }

  isRight(): this is Right<L, R> {
    return true
  }

  isLeft(): this is Left<L, R> {
    return false
  }
}

export type Either<L, R> = Left<L, R> | Right<L, R>

export const left = <L, R>(value: L): Either<L, R> => {
  return new Left(value)
}

export const right = <L, R>(value: R): Either<L, R> => {
  return new Right(value)
}
