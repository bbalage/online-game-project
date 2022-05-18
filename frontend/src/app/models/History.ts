import { User } from "./User";

export interface History {
    id: number | null,
    user: User,
    score: number,
    date: Date
}