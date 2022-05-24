import { AdminDao } from "./AdminDAO";
import { UserDao } from "./UserDAO";
import { UserHistoryDAO } from "./UserHistoryDAO";


//////////////////////////////////////////////////////////
//This file will be removed or refactored in the future//
/////////////////////////////////////////////////////////

const userdao = new UserDao();
const userHistory = new UserHistoryDAO();
const admindao = new AdminDao();


admindao.addAdmin({
     id:2,
     username:"test",
     password:"asd"
 }).then(function(res){
     console.log("Add admin");
     console.log(res);
 }).catch(function(res){
     console.log("Add admin");
     console.log("ERROR");
     console.log(res);
 })

admindao.getLoginAdminId({
    id: 0,
     username: "admin",
     password: "asd"
 }).then(function(res){

    console.log("getloginadminid admin");
     console.log(res);
 }).catch(function(res){

    console.log("getloginadminid admin");
     console.log("ERROR");
     console.log(res);
 })


 admindao.getAdminById(0).then(function(res){
      console.log("getadminbyid admin");
     console.log(res);
 }).catch(function(res){
      console.log("getadminbyid admin");
     console.log(res);
 })

 userdao.addUser({
    id:10,
     username:"test",
     password:"asd"
 }).then(function(res){
     console.log("Add user");
    console.log(res);
 }).catch(function(res){
     console.log("Add user");
     console.log("ERROR");
     console.log(res);
 });


 userdao.deleteUserById(10)
 .then(function(res){
     console.log("delete user");
     console.log(res);
 }).catch(function(res){
     console.log("delete user");
     console.log(res);
 })


 admindao.addAdmin({
     id:10,
     username:"admin",
     password:"asd"
 }).then(function(res){
      console.log("Add admin");
     console.log(res);
 }).catch(function(res){
      console.log("Add admin");
     console.log("ERROR");
     console.log(res);
 })

 
 admindao.deleteAdminById(10).then(function(res){
     console.log("Delete admin");
     console.log(res);
 }).catch(function(res){
     console.log("Delete admin");
     console.log(res);
 })

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

// userdao.getLoginUserId(
//      {
//     id: 0,
//      username:"alma",
//      password:"asd"}
// ).then(function(res){
//     console.log("getLoginUserId");
//     console.log(res);
// }).catch(function(res){
//     console.log("ERROR");
//     console.log(res);
// })


// userdao.getLoginUserId(
//      {
//     id: 0,
//      username:"alma",
//      password:""}    //invalid password
// ).then(function(res){
//     console.log("getLoginUserId");
//     console.log(res);
// }).catch(function(res){
//     console.log("ERROR");
//     console.log(res);
// })


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