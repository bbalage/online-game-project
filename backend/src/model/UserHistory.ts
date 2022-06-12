import { UserSend } from "./User";

export interface UserHistoryLocal {
    id?: number,
    userId: number,
    score: number,
    date: Date
}

export interface UserHistorySend {
    id?: number,
    user: UserSend,
    score: number,
    date: Date
}