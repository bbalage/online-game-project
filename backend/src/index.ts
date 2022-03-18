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

const chatService = new ChatService();
const wsServer = new WebSocketService(server, chatService);
server.listen(port, () => {
    console.log('Listening on ' + port);
});