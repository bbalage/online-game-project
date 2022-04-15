import express from 'express';
import * as http from 'http';
import { UserDao } from './database/UserDAO';
import { UserHistoryDAO } from './database/UserHistoryDAO';
import { ChatService } from './websocket/chat-service';
import { WebSocketService } from './websocket/websocket-service';

const app = express();

//initialize a simple http server
const server = http.createServer(app);

//start our server
const port: number = 3000;

const webSocketService = new WebSocketService(server);
const chatService = new ChatService(webSocketService);
server.listen(port, () => {
    console.log('Listening on ' + port);
});