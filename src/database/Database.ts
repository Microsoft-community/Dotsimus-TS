import { Db, Document } from "mongodb";
import { ServerConfig } from "./models/ServerConfig";

export class Database {
    db: Db
    
    constructor(db: Db) {
        this.db = db;
    }

    async getServerConfig(serverId: String) {
        var doc = await this.db.collection("ServersConfig").findOne({ serverId: serverId });
        if (doc == undefined)
            return null;
        return doc as ServerConfig;
    }

    async setServerConfig(serverConfig: ServerConfig) {
        return this.db.collection("ServersConfig").findOneAndReplace({ serverId: serverConfig.serverId }, serverConfig);
    }
}