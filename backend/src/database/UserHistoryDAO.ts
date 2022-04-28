import { RunResult, Statement } from "sqlite3";
import { UserHistory } from "../model/UserHistory";
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


    addUserHistory(userHistory: UserHistory): Promise<boolean> {
        return new Promise<boolean>(function (resolve, reject) {
            let prepared: Statement = getConnection().prepare("INSERT INTO user_history(userid,score,date) VALUES(?,?,?);");
            prepared.run(userHistory.user.id, userHistory.score, userHistory.date, (runResult: RunResult, err: Error | null) => {
                if (!err) {
                    resolve(true);
                }
                else {
                    reject(false);
                }
            });
        });
    }

    getUserHistoryById(id: number): Promise<UserHistory> {
        return new Promise<UserHistory>(function (resolve, reject) {
            let prepared: Statement = getConnection().prepare("SELECT id, score, userid, date FROM user_history where id=?;");
            prepared.get(id, (err, row) => {
                if (!err) {
                    let userHistory: UserHistory = {
                        id: row.id,
                        score: row.score,
                        user: {
                            id: row.userid,
                            username: "",
                            password: ""
                        },
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

    getAllUserHistory(): Promise<UserHistory[]> {
        let prepared: Statement = getConnection().prepare("SELECT id, score, userid, date FROM user_history;");

        return new Promise<UserHistory[]>(function (resolve, reject) {
            prepared.all((err, rows) => {
                if (!err) {
                    console.log(rows);
                    let historyList: UserHistory[] = []

                    for (const row of rows) {
                        let userHistory: UserHistory = {
                            id: row.id,
                            score: row.score,
                            user: {
                                id: row.userid,
                                username: "",
                                password: ""
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