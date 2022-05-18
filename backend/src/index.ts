import express from 'express';
import * as http from 'http';
import { UserDao } from './database/UserDAO';
import { UserHistoryDAO } from './database/UserHistoryDAO';
import { ChatService } from './websocket/chat-service';
import { WebSocketService } from './websocket/websocket-service';
import * as WebSocket from "ws";
import { getRouter } from "./routes/auth.route";
import cors from "cors";
import { getHistoryRouter } from "./routes/history.route";

const app = express();

//initialize a simple http server
const server = http.createServer(app);

const allowedOrigins = ["http://localhost:4200"];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

app.use(cors(options));
app.use(express.json());

//start our server
const port: number = 3000;

const webSocketService = new WebSocketService(server);
const chatService = new ChatService(webSocketService);
server.listen(port, () => {
  console.log("Listening on " + port);
  app.use("/users", getRouter());
  app.use("/histories", getHistoryRouter());
});