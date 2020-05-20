import { Socket, Server } from "socket.io";
import Repository from "../network/request/Repository";

export default class BaseEventHandler {
    protected idUser: string;

    protected repository = new Repository();

    protected socket: Socket;
    protected server: Server;

    constructor(socket: Socket, server: Server){
        this.idUser = socket.handshake.headers['x-lets-connect-id-user'];

        this.socket = socket;
        this.server = server;
    }

    /**
     * Check whether user is anonymous or not
     */
    protected isAnonymous(): boolean { return this.idUser == null }

    /**
     * Get current date time
     * @return DateTime yyyy-MM-dd HH:mm:ss as String
     */
    protected currentDateTime(): string { 
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

        return date+' '+time;
    }

    /**
     * Get current millisecond since epoch
     * @return millisecond since epoch
     */
    protected millisecondSinceEpoch(): number {
        return new Date().valueOf();
    }
}