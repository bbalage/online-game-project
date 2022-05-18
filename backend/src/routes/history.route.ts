import { Router } from "express";
import { UserHistoryDAO } from "../database/UserHistoryDAO";
import { UserHistory } from "../model/UserHistory";

const router = Router();
const historydao = new UserHistoryDAO();

export function getHistoryRouter(): Router {
    router.get("/getOne", async function (req, res) {
        const historyId = req.query.id as unknown as number;

        historydao
            .getUserHistoryById(historyId)
            .then(function (history) {
                res.status(200).send(history);
            })
            .catch(function () {
                res.status(400).send("Bad request");
            });
    });

    router.post("/add", async function (req, res) {
        const history: UserHistory = req.body.History;
        historydao
            .addUserHistory(history)
            .then(function (result) {
                res.status(200).send();
            })
            .catch(function () {
                res.status(400).send("Bad request");
            });
    });

    router.get("/get", async function (req, res) {
        historydao.getAllUserHistory()
            .then(function (histories: UserHistory[]) {
                console.log(histories);
                res.status(200).send(histories);
            })
            .catch(function () {
                res.status(500).send("Database is currently unavailable");
            });
    });

    return router;
}
