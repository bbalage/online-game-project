import { User } from "./User";

export interface UserHistory{
    id: number,
    user: User,
    score: number,
    date: Date
}