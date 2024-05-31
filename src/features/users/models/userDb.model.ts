export interface IUserDbModel {
    _id: string,
    login: string
    email: string
    createdAt: string
    password: string
    confirmationCode: string
    confirmationCodeExpired: Date
    isConfirmed: boolean
}