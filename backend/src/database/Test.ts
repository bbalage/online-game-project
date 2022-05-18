import { UserDao } from "./UserDAO";
import { UserHistoryDAO } from "./UserHistoryDAO";


//////////////////////////////////////////////////////////
//This file will be removed or refactored in the future//
/////////////////////////////////////////////////////////

const userdao = new UserDao();
const userHistory = new UserHistoryDAO();

// userdao.addUser({
//     id:0,
//     username:"almb",
//     password:"asd"
// }).then(function(res){
//     console.log(res);
// }).catch(function(res){
//     console.log("ERROR");
//     console.log(res);
// })

// userdao.getLoginUserId({
//     id: 0,
//     username: "al",
//     password: "asd"
// }).then(function(res){
//     console.log(res);
// }).catch(function(res){
//     console.log("ERROR");
//     console.log(res);
// })

userdao.getLoginUserId(
     {
    id: 0,
     username:"alma",
     password:"asd"}
).then(function(res){
    console.log("getLoginUserId");
    console.log(res);
}).catch(function(res){
    console.log("ERROR");
    console.log(res);
})


userdao.getLoginUserId(
     {
    id: 0,
     username:"alma",
     password:""}    //invalid password
).then(function(res){
    console.log("getLoginUserId");
    console.log(res);
}).catch(function(res){
    console.log("ERROR");
    console.log(res);
})


// userdao.getAllUserNameAndId()
// .then(function(res){
//     console.log("gut:"+res);
// }).catch(function(res){
//     console.log("ERROR");
//     console.log("bad"+res);
// })

// userdao.getAllUserNameAndId().then().catch()



// userHistory.addUserHistory({
//     id:0,
//     user:{
//         id:1,
//         password:"",
//         username:"alma"
//     },
//     date:new Date(),
//     score:10
// }).then(console.log).catch(console.log);

// userHistory.getUserHistoryById(1).then((res)=>{
//     userdao.getUserById(res.user.id).then(console.log)
// })