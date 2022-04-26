import { Router } from "express";
import * as fs from "fs";
import jwt from "jsonwebtoken";
import { UserDao } from "../database/UserDAO";
import { User } from "../model/User";

const RSA_PRIVATE_KEY = fs.readFileSync(__dirname + "../../keys/jwtRS256.key");
const bearerExpirationTimeSeconds = 7200;
const router = Router();
const userdao = new UserDao();

export function getRouter(): Router {
  router.post("/validateUser", async function (req, res) {
    const user: User = req.body.User;

    userdao
      .getLoginUserId(user)
      .then(function (rowId) {
        const jwtBearerToken = jwt.sign({}, RSA_PRIVATE_KEY, {
          algorithm: "RS256",
          expiresIn: bearerExpirationTimeSeconds,
          subject: rowId.toString(),
        });

        res.status(200).json({
          idToken: jwtBearerToken,
          expiresIn: bearerExpirationTimeSeconds,
        });
      })
      .catch(function () {
        res.status(401).send("Unauthorized");
      });
  });

  router.post("/addUser", async function (req, res) {
    const user: User = req.body.User;

    userdao
      .addUser(user)
      .then(function (result) {
        res.status(200).send();
      })
      .catch(function () {
        res.status(406).send("User Already created");
      });
  });

  router.get("/getUsers", async function (req, res) {
    userdao.getAllUserNameAndId()
      .then(function (users: User[]) {
        console.log(users);
        res.status(200).send(users);
      })
      .catch(function () {
        res.status(500).send("Database is currently unavailable");
      });
  });

  return router;
}