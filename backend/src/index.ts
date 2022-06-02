import express from 'express';
import * as http from 'http';
import { UserDao } from './database/UserDAO';
import { UserHistoryDAO } from './database/UserHistoryDAO';
import { ChatService } from './websocket/chat-service';
import { WebSocketService } from './websocket/websocket-service';
import { getRouter as getUsersRouter } from "./routes/auth.route";
import cors from "cors";
import { getHistoryRouter } from "./routes/history.route";
import { GameService } from './websocket/game-service';
import { ActiveUserService } from './websocket/activeUser-service';
import { Game } from './gameloop/game';

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

const activeUserService: ActiveUserService = new ActiveUserService();
const webSocketService = new WebSocketService(server);
const chatService = new ChatService(webSocketService, activeUserService);
const gameService = new GameService(webSocketService);
const game = new Game();
const fps = 1000 / 30; // milliseconds / rate
setInterval(() => game.loop(), fps);
server.listen(port, () => {
  console.log("Listening on " + port);
  app.use("/users", getUsersRouter(activeUserService));
  app.use("/histories", getHistoryRouter());
});