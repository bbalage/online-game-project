import { Router } from "express";
import { userHistoryDao, UserHistoryDAO } from "../database/UserHistoryDAO";
import { UserHistoryLocal, UserHistorySend } from "../model/UserHistory";

const router = Router();


export function getHistoryRouter(): Router {
    router.get("/getOne", async function (req, res) {
        const historyId = req.query.id as unknown as number;

        userHistoryDao
            .getUserHistoryById(historyId)
            .then(function (history) {
                res.status(200).send(history);
            })
            .catch(function () {
                res.status(400).send("Bad request");
            });
    });

    router.post("/add", async function (req, res) {
        const history: UserHistoryLocal = req.body.History;
        userHistoryDao
            .addUserHistory(history)
            .then(function (result) {
                res.status(200).send();
            })
            .catch(function () {
                res.status(400).send("Bad request");
            });
    });

    router.get("/get", async function (req, res) {
        userHistoryDao.getAllUserHistory()
            .then(function (histories: UserHistorySend[]) {
                console.log(histories);
                res.status(200).send(histories);
            })
            .catch(function () {
                res.status(500).send("Database is currently unavailable");
            });
    });

    return router;
}
