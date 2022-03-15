import { Statement } from 'sqlite3';
import { User } from '../model/User';
import { getConnection } from './Connection';

export class UserDao{
    private db;

    constructor(){
        this.db = getConnection();
        this.init();

    }

    private init(){
        this.db.run("CREATE TABLE user ( id integer primary key, username text not null, password text not null);", function(err){
            if (err){
                console.log("User table already created!");
            }
            else{
                console.log("User table successfully created!");
            }
        });
    }

    addUser(user:User):boolean{
        let prepared:Statement = this.db.prepare("SELECT id FROM user WHERE username=?");
        let id=-1;
        prepared.get(user.username,function(stmt:Statement,err:Error|null,row:any){
            if (!err){
                id=row.id;
            }
        })
        if (id==-1){
            let prepared:Statement = this.db.prepare("INSERT INTO user(username,password) VALUES(?,?);");
            prepared.run(user.username,user.password);
            return true;
        }
        return false;
    }

    getLoginUserId(user:User):number{
        let prepared:Statement = this.db.prepare("SELECT id FROM user WHERE username=? AND password=?");
        let id=-1;
        prepared.get(user.username,user.password,function(stmt:Statement,err:Error|null,row:any){
            if (!err){
                id=row.id;
            }
        })
        if (id>=0){
            console.log(user.username+" successfully logged in!");
            return id
        }
        return -1;
    }

    getAllUserNameAndId():User[]{
        let prepared:Statement = this.db.prepare("SELECT id, username FROM user");
        let userList:User[] = []
        prepared.all(function (err,rows){
            rows.forEach((row)=>{
                userList.push({
                    id:row.id,
                    username:row.username,
                    password:""
                }); 
            })
        })
        return userList;
    }





}
