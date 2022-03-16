import express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import { UserDao } from './database/UserDAO';

const app = express();

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

const userdao = new UserDao();
/*
userdao.addUser({
    id:null,
    username:"almb",
    password:"asd"
}).then(function(res){
    console.log(res);
}).catch(function(res){
    console.log(res);
})

userdao.getLoginUserId({
    id:null,
    username: "al",
    password: "asd"
}).then(function(res){
    console.log(res);
}).catch(function(res){
    console.log(res);
})
*/

userdao.getAllUserNameAndId()
.then(function(res){
    console.log("gut:"+res);
}).catch(function(res){
    console.log("bad"+res);
})


wss.on('connection', (ws: WebSocket) => {

    //connection is up, let's add a simple simple event
    ws.on('message', (message: string) => {

        //log the received message and send it back to the client
        console.log('received: %s', message);
        ws.send(`Hello, you sent -> ${message}`);

    });

    //send immediatly a feedback to the incoming connection
    ws.send('Hi there, I am a WebSocket server');
});

//start our server
const port: number = 3000;
server.listen(port, () => {
    console.log('Listening on ' + port);
});