"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var socket_io_1 = __importDefault(require("socket.io"));
var http_1 = __importDefault(require("http"));
var index_1 = require("./event/index");
var Global_1 = require("./global/Global");
var app = express_1.default();
var http = http_1.default.createServer(app);
var io = socket_io_1.default(http, {
    pingTimeout: 15000,
    pingInterval: 15000,
});
/**
 * Middleware Server
 *
 * throw Authentication Error when no headers with
 * x-lets-connect-id-user found
 */
io.use(function (socket, next) {
    var userId = socket.handshake.headers['x-lets-connect-id-user'];
    if (userId != null) {
        return next();
    }
    return next(new Error('Authentication Error, User  must be defined'));
});
/**
 * Automatically called when user connected to socket with namespace /chat
 */
io.on(index_1.ChatEvent.CONNECTED, function (socket) {
    var event = index_1.registerChatEventHandler(socket, io);
    socket.on(index_1.ChatEvent.TYPING, function (data) { return event.onTyping(data); });
    socket.on(index_1.ChatEvent.SENDING_MESSAGE, function (data, callback) { return event.onSendChat(data, callback); });
    socket.on(index_1.ChatEvent.RECEIVING_MESSAGE, function (data) { return event.onReceiveChat(data); });
    socket.on(index_1.ChatEvent.ASK_FOR_DELAYED_MESSAGE, function (_, callback) { return event.onAskingForDelayedMessage(callback); });
    socket.on(index_1.ChatEvent.ASK_FOR_UPDATED_MESSAGE_REPORT, function (data, callback) { return event.onAskingForLatestReportMessage(data, callback); });
    socket.on(index_1.ChatEvent.READING_MESSAGE, function (data) { return event.onReadChat(data); });
    socket.on(index_1.ChatEvent.GO_TO_FOREGROUND, function () { return event.onForeground(); });
    socket.on(index_1.ChatEvent.GO_TO_BACKGROUND, function () { return event.onBackground(); });
    socket.on(index_1.ChatEvent.DISCONNECTED, function () { return event.onDisconnect(); });
    event.onConnect();
});
app.get('/86to88', function (req, res) {
    res.sendFile('/home/admin/web/chat.letsconnectproject.com/node/page/86to88.html');
});
app.get('/88to86', function (req, res) {
    res.sendFile('/home/admin/web/chat.letsconnectproject.com/node/page/88to86.html');
});
app.get('/88to89', function (req, res) {
    res.sendFile('/home/admin/web/chat.letsconnectproject.com/node/page/88to89.html');
});
app.get('/89to88', function (req, res) {
    res.sendFile('/home/admin/web/chat.letsconnectproject.com/node/page/89to88.html');
});
/**
* Register socket to port :3000
*/
http.listen(3000, function () { return Global_1.logger.info('Connection Established'); });
