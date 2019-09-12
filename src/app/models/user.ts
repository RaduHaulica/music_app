export interface User {
    _id?: string,
    id: number,
    username: string,
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: string,
    token?: string
}