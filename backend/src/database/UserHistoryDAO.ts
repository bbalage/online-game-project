import { RunResult, Statement } from "sqlite3";
import { UserHistoryLocal, UserHistorySend } from "../model/UserHistory";
import { getConnection } from "./Connection";


export class UserHistoryDAO {

    constructor() {
        this.init()
    }

    private async init() {
        getConnection().run("CREATE TABLE user_history ( id integer primary key, userid number not null, score number not null, date not null, FOREIGN KEY(userid) REFERENCES user(id));", function (err) {
            if (err) {
                console.log("User_History table already created!");
            }
            else {
                console.log("User_History table successfully created!");
            }
        });
    }


    addUserHistory(userHistory: UserHistoryLocal): Promise<boolean> {
        return new Promise<boolean>(function (resolve, reject) {
            let prepared: Statement = getConnection().prepare("INSERT INTO user_history(userid,score,date) VALUES(?,?,?);");
            prepared.run(userHistory.userId, userHistory.score, userHistory.date, (runResult: RunResult, err: Error | null) => {
                if (!err) {
                    resolve(true);
                }
                else {
                    reject(false);
                }
            });
        });
    }

    getUserHistoryById(id: number): Promise<UserHistorySend> {
        return new Promise<UserHistorySend>(function (resolve, reject) {
            let prepared: Statement = getConnection().prepare(
                "SELECT h.id as id, h.score as score, h.userid as userid, h.date as date, u.username as username FROM user_history h join user u on u.id = h.userid where h.id=?;");
            prepared.get(id, (err, row) => {
                if (!err) {
                    let userHistory: UserHistorySend = {
                        id: row.id,
                        score: row.score,
                        user: { username: row.username },
                        date: new Date(row.date)
                    }
                    resolve(userHistory);
                }
                else {
                    reject(row);
                }
            });
        });
    }

    getAllUserHistory(): Promise<UserHistorySend[]> {
        let prepared: Statement = getConnection().prepare(
            "SELECT h.id as id, h.score as score, h.userid as userid, h.date as date, u.username as username FROM user_history h join user u on u.id = h.userid;");

        return new Promise<UserHistorySend[]>(function (resolve, reject) {
            prepared.all((err, rows) => {
                if (!err) {
                    let historyList: UserHistorySend[] = []

                    for (const row of rows) {
                        let userHistory: UserHistorySend = {
                            id: row.id,
                            score: row.score,
                            user: {
                                username: row.username,
                            },
                            date: new Date(row.date)
                        }
                        historyList.push(userHistory);
                    }
                    resolve(historyList);
                }
                else {
                    reject([]);
                }
            });
        });
    }



}

export const userHistoryDao = new UserHistoryDAO();