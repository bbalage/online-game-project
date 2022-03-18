import { Router } from "express";
import * as fs from "fs";
import jwt from "jsonwebtoken";
// import { UserDao } from "../database/UserDAO";
// const errorHandling = require('../util/error-handling');

//TODO: generate key
const RSA_PRIVATE_KEY = fs.readFileSync("./../keys/jwtRS256.key"); 
const bearerExpirationTimeSeconds = 7200;
const router = Router();


export function getRouter(): Router {
  router.post("/auth", async function (req, res) {
    const email = req.body.email;

    if (await validateUserameAndPassword(email, req.body.password)) {
      const adminId = await findUserId(email);

      const jwtBearerToken = jwt.sign({}, RSA_PRIVATE_KEY, {
        algorithm: "RS256",
        expiresIn: bearerExpirationTimeSeconds,
        subject: adminId,
      });

      res.status(200).json({
        idToken: jwtBearerToken,
        expiresIn: bearerExpirationTimeSeconds,
      });
    } else {
      res.sendStatus(401);
    }
  });

  return router;
}

async function validateUserameAndPassword(
  email: string,
  password: string
): Promise<boolean> {
  //   const admin = UserDao.getLoginUserId(email);
  //   if (!admin) {
  //     return false;
  //   }
  //   return validatePasswordForAdmin(admin, password);
  return false;
}

//TODO: create method in UserDao
async function findUserId(username: string): Promise<string> {
  //   const admin = await UserDao.get;
  //   return admin.id.toString();

  return "id";
}
