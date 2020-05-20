import express from 'express';
import socket, { Socket } from 'socket.io';
import _http from 'http';
import { registerChatEventHandler, ChatEvent } from './event/index';
import { logger } from './global/Global';

let app = express();
let http = _http.createServer(app);
let io = socket(http, {
    pingTimeout: 15000,
    pingInterval: 15000,
});

/**
 * Middleware Server
 * 
 * throw Authentication Error when no headers with
 * x-lets-connect-id-user found
 */
io.use((socket, next) => {
    let userId = socket.handshake.headers['x-lets-connect-id-user'];

    if(userId != null){
        return next();
    }

    return next(new Error('Authentication Error, User  must be defined'));
});

/**
 * Automatically called when user connected to socket with namespace /chat
 */
io.on(ChatEvent.CONNECTED, function(socket: Socket){
    let event = registerChatEventHandler(socket, io);

    socket.on(ChatEvent.TYPING, (data) => event.onTyping(data));
    socket.on(ChatEvent.SENDING_MESSAGE, (data, callback) => event.onSendChat(data, callback));
    socket.on(ChatEvent.RECEIVING_MESSAGE, (data) => event.onReceiveChat(data));
    socket.on(ChatEvent.ASK_FOR_DELAYED_MESSAGE, (_, callback) => event.onAskingForDelayedMessage(callback));
    socket.on(ChatEvent.ASK_FOR_UPDATED_MESSAGE_REPORT, (data, callback) => event.onAskingForLatestReportMessage(data, callback));
    socket.on(ChatEvent.READING_MESSAGE, (data) => event.onReadChat(data));
    socket.on(ChatEvent.GO_TO_FOREGROUND, () => event.onForeground());
    socket.on(ChatEvent.GO_TO_BACKGROUND, () => event.onBackground());
    socket.on(ChatEvent.DISCONNECTED, () => event.onDisconnect());

    event.onConnect(); 
}); 

app.get('/86to88', (req, res) => {
    res.sendFile('/home/admin/web/chat.letsconnectproject.com/node/page/86to88.html');
});  

app.get('/88to86', (req, res) => {
    res.sendFile('/home/admin/web/chat.letsconnectproject.com/node/page/88to86.html');
});  

app.get('/88to89', (req, res) => {
    res.sendFile('/home/admin/web/chat.letsconnectproject.com/node/page/88to89.html');
});  

app.get('/89to88', (req, res) => {
    res.sendFile('/home/admin/web/chat.letsconnectproject.com/node/page/89to88.html');
});  

/**
* Register socket to port :3000
*/
http.listen(3000, () => logger.info('Connection Established'));
