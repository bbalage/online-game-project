export interface User {
    id: number
    username: string
    password: string
}

export interface ActiveUser {
    user: User,
    expiresAt: number
}