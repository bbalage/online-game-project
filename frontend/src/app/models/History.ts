import { UserReceived } from "./User";

export interface History {
    id: number | null,
    user: UserReceived,
    score: number,
    date: Date
}