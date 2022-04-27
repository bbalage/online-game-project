import { Statement } from 'sqlite3';
import { User } from '../model/User';
import { getConnection } from './Connection';

export class UserDao{

    constructor(){
        this.init()
    }

    private async init(){
        getConnection().run("CREATE TABLE user ( id integer primary key, username text not null, password text not null);", function(err){
            if (err){
                console.log("User table already created!");
            }
            else{
                console.log("User table successfully created!");
            }
        });
    }

    addUser(user:User):Promise<boolean>{
        let prepared:Statement = getConnection().prepare("SELECT id FROM user WHERE username=?");
        return new Promise(function(resolve,reject){
        prepared.get(user.username,function(err:Error|null,row:any){
            if (!err){
                if (!row){
                    let prepared:Statement = getConnection().prepare("INSERT INTO user(username,password) VALUES(?,?);");
                    prepared.run(user.username,user.password);
                    console.log("New user added");
                    resolve(true);
                }
                else{
                    console.log("User Already created");
                    reject(false);
                }
            }
        });
        });
    }

    getLoginUserId(user:User):Promise<number>{
        let prepared:Statement = getConnection().prepare("SELECT id FROM user WHERE username=? AND password=?");
        return new Promise(function(resolve,reject){
        prepared.get(user.username,user.password,function(err:Error|null,row:any){
            if (!err){
                if (row){
                    resolve(row.id);
                }
                else{
                    reject(-1);
                }
            }
        })
        })
    }

    getAllUserNameAndId():Promise<any>{
        let prepared:Statement = getConnection().prepare("SELECT id, username FROM user");
        
        return new Promise(function(resolve,reject){
            prepared.all(function (err,rows){
                    if (!err){
                        console.log(rows);
                        let userList:User[] = []
                        for (const row of rows){
                            let user:User={
                                id:row.id,
                                username:row.username,
                                password:""

                            }
                            userList.push(user);
                        }
                        resolve(userList);
                    }
                    else{
                        resolve([]);
                    }
                });
            });
    }

    getUserById(id:number):Promise<User>{
        let prepared:Statement = getConnection().prepare("SELECT id, username FROM user WHERE id=?");
        return new Promise(function(resolve,reject){
        prepared.get(id,function(err:Error|null,row:any){
            if (!err){
                if (row){
                    let user:User={
                        id:row.id,
                        username:row.username,
                        password:""
                    }
                    resolve(user);
                }
                else{
                    reject(-1);
                }
            }
        })
        })
    }





}
