import { Router } from "express";
import * as fs from "fs";
import jwt from "jsonwebtoken";
import { AdminDao } from "../database/AdminDao";
import { User } from "../model/User";
import { ActiveAdminService } from "../websocket/activeAdmin-service";

const RSA_PRIVATE_KEY = fs.readFileSync("src/keys/jwtRS256.key");
const bearerExpirationTimeSeconds = 7200;
const router = Router();
const admindao = new AdminDao();

export function getRouter(activeAdminService: ActiveAdminService): Router {
  router.post("/validate", async function (req, res) {
    const user: User = req.body.User;
    admindao
      .getLoginAdminId(user)
      .then(function (rowId) {
        const jwtBearerToken = jwt.sign(
          {
            isAdmin: true,
          },
          RSA_PRIVATE_KEY,
          {
            algorithm: "RS256",
            expiresIn: bearerExpirationTimeSeconds,
            subject: rowId.toString(),
          }
        );
        user.id = rowId;
        activeAdminService.setAdmin(
          jwtBearerToken,
          bearerExpirationTimeSeconds,
          user
        );
        res.status(200).json({
          idToken: jwtBearerToken,
          expiresIn: bearerExpirationTimeSeconds,
        });
      })
      .catch(function () {
        res.status(401).send("Unauthorized");
      });
  });

  router.get("/check", async function (req, res) {
    const token: string = req.body.token;
    if (activeAdminService.getId(token)) {
      res.status(200).send();
    } else {
      res.status(401).send();
    }
  });

  return router;
}
