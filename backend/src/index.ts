import express from 'express';
import * as http from 'http';
import { ChatService } from './chat/chat-service';
import { WebSocketService } from './websocket/websocket-service';
import { getRouter as getUsersRouter } from "./routes/auth.route";
import { getRouter as getAdminRouter } from "./routes/admin.route";
import cors from "cors";
import { getHistoryRouter } from "./routes/history.route";
import { GameService } from './game/game-service';
import { ActiveUserService } from './websocket/activeUser-service';
import { Game } from './game/game';
import { ActiveAdminService } from './websocket/activeAdmin-service';
import { ScoreLoggerService } from './game/score-logger-service';

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
const activeAdminService: ActiveAdminService = new ActiveAdminService();
const scoreLoggerService: ScoreLoggerService = new ScoreLoggerService();
const webSocketService = new WebSocketService(server, activeUserService, activeAdminService);
const chatService = new ChatService(webSocketService, activeUserService, activeAdminService);
const gameService = new GameService(webSocketService, activeUserService, scoreLoggerService);
const game = new Game(gameService);
const fps = 1000 / 30; // milliseconds / rate
setInterval(() => game.loop(), fps);
server.listen(port, '0.0.0.0', () => {
  console.log("Listening on " + port);
  app.use("/users", getUsersRouter(activeUserService));
  app.use("/admin", getAdminRouter(activeAdminService));
  app.use("/histories", getHistoryRouter());
});