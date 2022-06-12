export interface User {
    id: number
    username: string
    password: string
}

export interface UserSend {
    username: string
}

export interface ActiveUser {
    user: User,
    expiresAt: number
}