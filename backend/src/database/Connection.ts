import Sqlite3, { Statement } from 'sqlite3';

interface Config
{
    path: string;
}


const configFile = "./sqlite-config.json"
const config:Config = require(configFile);
const connection = new Sqlite3.Database(config.path);

export function getConnection(){
    return connection;
}

export function closeConnection(){
    connection.close();
}
