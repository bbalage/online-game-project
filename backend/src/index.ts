import express from 'express';
import * as http from 'http';
import { UserDao } from './database/UserDAO';
import { UserHistoryDAO } from './database/UserHistoryDAO';
import { ChatService } from './websocket/chat-service';
import { WebSocketService } from './websocket/websocket-service';
import * as WebSocket from "ws";
import { getRouter } from "./routes/auth.route";
import cors from "cors";

const app = express();

//initialize a simple http server
const server = http.createServer(app);
//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

const allowedOrigins = ["http://localhost:4200"];

const options: cors.CorsOptions = {
    origin: allowedOrigins,
};

app.use(cors(options));
app.use(express.json());

wss.on("connection", (ws: WebSocket) => {
  //connection is up, let's add a simple simple event
  ws.on("message", (message: string) => {
    //log the received message and send it back to the client
    console.log("received: %s", message);
    ws.send(`Hello, you sent -> ${message}`);
  });

  //send immediatly a feedback to the incoming connection
  ws.send("Hi there, I am a WebSocket server");
});

//start our server
const port: number = 3000;

const webSocketService = new WebSocketService(server);
const chatService = new ChatService(webSocketService);
server.listen(port, () => {
  console.log("Listening on " + port);
  app.use("/users", getRouter());
});