import { Statement } from 'sqlite3';
import { User } from '../model/User';
import { getConnection } from './Connection';

export class AdminDao {

    constructor() {
        this.init()
    }

    private async init() {
        getConnection().run("CREATE TABLE admin ( id integer primary key, username text not null, password text not null);", function (err) {
            if (err) {
                console.log("Admin table already created!");
            }
            else {
                console.log("Admin table successfully created!");
            }
        });
    }

    addAdmin(admin: User): Promise<boolean> {
        let prepared: Statement = getConnection().prepare("SELECT id FROM admin WHERE username=?");
        return new Promise(function (resolve, reject) {
            prepared.get(admin.username, function (err: Error | null, row: any) {
                if (!err) {
                    if (!row) {
                        let prepared: Statement = getConnection().prepare("INSERT INTO admin(username,password) VALUES(?,?);");
                        prepared.run(admin.username, admin.password);
                        console.log("New admin added");
                        resolve(true);
                    }
                    else {
                        console.log("Admin Already created");
                        reject(false);
                    }
                }
            });
        });
    }

    getLoginAdminId(admin: User): Promise<number> {
        let prepared: Statement = getConnection().prepare("SELECT id FROM admin WHERE username=? AND password=?");
        return new Promise(function (resolve, reject) {
            prepared.get(admin.username, admin.password, function (err: Error | null, row: any) {
                if (!err) {
                    if (row) {
                        resolve(row.id);
                    }
                    else {
                        reject(-1);
                    }
                }
            })
        })
    }

    getAdminById(id: number): Promise<User> {
        let prepared: Statement = getConnection().prepare("SELECT id, username FROM admin WHERE id=?");
        return new Promise(function (resolve, reject) {
            prepared.get(id, function (err: Error | null, row: any) {
                if (!err) {
                    if (row) {
                        let admin: User = {
                            id: row.id,
                            username: row.username,
                            password: ""
                        }
                        resolve(admin);
                    }
                    else {
                        reject(-1);
                    }
                }
            })
        })
    }

    deleteAdminById(id: number):Promise<boolean>{
        let prepared: Statement = getConnection().prepare("DELETE FROM admin where id=?");
        return new Promise(function (resolve,reject){
            prepared.run(id, function(err: Error| null){
                if (!err){
                    console.log("Admin "+id+" has been deleted");
                    resolve(true);
                }
                else{
                    console.log("No such an admin");
                    reject(false);
                }
            })
        })
    }



}
