import { CryptoExtension } from "../extensions/crypto.extension";

export class LoggedInUser {
    constructor(access_token: string, username: string, fullName: string, email: string, avatar: string,ConfigSession :any) {
        this.access_token = access_token;
        this.fullName = fullName;
        this.userName = username;
        this.email = email;
        this.avatar = avatar;
        
        this.ConfigSession = ConfigSession;
    }
    public id: string;
    public access_token: string;
    public mailToken: string;
    public userName: string;
    public fullName: string;
    public email: string;
    public avatar: string;
    public ConfigSession: any;
    public usc:string;
}