import { userHistoryDao } from "../database/UserHistoryDAO";
import { BULLET_DAMAGE } from "../model/GameStatus";
import { UserHistoryLocal } from "../model/UserHistory";


export class ScoreLoggerService {

    private scores: Map<number, number> = new Map<number, number>();

    raiseScore(id: number) {
        const userHistory: UserHistoryLocal = {
            userId: id,
            score: BULLET_DAMAGE,
            date: new Date()
        }
        userHistoryDao.addUserHistory(userHistory);
    }
}