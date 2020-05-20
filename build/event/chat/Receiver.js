"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Emitter_1 = __importDefault(require("./Emitter"));
var Broadcaster_1 = __importDefault(require("./Broadcaster"));
var Global_1 = require("../../global/Global");
var BaseEventHandler_1 = __importDefault(require("../../parents/BaseEventHandler"));
/**
 * Class that handle event retrieved from App
 * in /chat namespace
 */
var ChatEventReceiver = /** @class */ (function (_super) {
    __extends(ChatEventReceiver, _super);
    function ChatEventReceiver(socket, server) {
        var _this = _super.call(this, socket, server) || this;
        _this.emitter = new Emitter_1.default(socket, server);
        _this.broadcaster = new Broadcaster_1.default(socket, server);
        return _this;
    }
    /**
     * Update online status
     *
     * Called when user connected
     *
     * Joining room with same school ID
     *
     * Storing socket id to Connected Cache
     *
     * Remove socket from Inactive Cache
     */
    ChatEventReceiver.prototype.onConnect = function () {
        var _this = this;
        if (this.isAnonymous())
            return;
        var params = {
            'id_user': this.idUser,
            'socket_id': this.socket.id,
        };
        this.repository.online(params, function (_) {
            _this.broadcaster.broadcastOnline();
            Global_1.ConnectedUserCache.set(_this.idUser, _this.socket.id);
        });
    };
    /**
     * Similar as @see onConnect()
     * but with different cache storing, and not joining room
     * in @see onConnect() we store user to Connected Cache
     * but in @see onForeground() we remove user from Inactive Cache
     */
    ChatEventReceiver.prototype.onForeground = function () {
        var _this = this;
        if (this.isAnonymous())
            return;
        var params = {
            'id_user': this.idUser,
            'socket_id': this.socket.id,
        };
        this.repository.online(params, function (_) {
            _this.broadcaster.broadcastOnline();
            Global_1.InactiveUserCache.del(_this.idUser);
        });
    };
    /**
     * Similar as @see onDisconnect()
     * but with different cache storing, and not leaving room
     * in @see onDisconnect() we remove user from Connected Cache
     * but in @see onBackground() we store user to Inactive Cache
     */
    ChatEventReceiver.prototype.onBackground = function () {
        var _this = this;
        if (this.isAnonymous())
            return;
        var params = {
            'id_user': this.idUser,
            'socket_id': this.socket.id,
        };
        this.repository.offline(params, function (res) {
            _this.broadcaster.broadcastOffline(res);
            Global_1.InactiveUserCache.set(_this.idUser, _this.socket.id);
        });
    };
    /**
     * Notify to interlocutor that user is typing
     * Then app change status to "Typing..."
     * @param data, which contains
     * @var target_id => Interlocutor id,
     */
    ChatEventReceiver.prototype.onTyping = function (data) {
        if (this.isAnonymous())
            return;
        this.emitter.onUserSendTypingNotif(data);
    };
    /**
     * User sends chat
     * @param data chat data, which contains
     * @var conversation_id => Unique ID generated from App
     * @var conversation => Message
     * @var send_at => Time when user trying to send the message, cause maybe there will be
     * a delay either no internet connection, so sender cannot send that message at that time,
     * app should check periodically and send message automatically when internet connection established
     * @var target_id => Receiver Id
     *
     * @param callback callback that chat has retrieved by server, so the UI
     * change chat status to "SENT" or one checklist like in WhatsApp, contains parameter
     * @var conversation_id => Unique ID generated from App
     * @var received_by_server_at => Datetime yyyy-MM-dd HH:mm:ss
     */
    ChatEventReceiver.prototype.onSendChat = function (data, callback) {
        var _this = this;
        if (this.isAnonymous())
            return;
        var params = {
            'conversation_id': data.conversation_id,
            'sender_id': this.idUser,
            'receiver_id': data.target_id,
            'conversation': data.conversation,
            'send_at': data.send_at
        };
        this.repository.insertConversation(params, function (r) {
            var emitData = {
                'conversation_id': data.conversation_id,
                'sender_id': _this.idUser,
                'receiver_id': data.target_id,
                'conversation': data.conversation.trim(),
                'received_by_server_at': r.received_by_server_at,
                'sender': {
                    'id': r.sender.id,
                    'fullname': r.sender.fullname,
                    'email': r.sender.email,
                    'image': r.sender.image,
                    'username': r.sender.username
                }
            };
            callback({
                'conversation_id': data.conversation_id,
                'received_by_server_at': r.received_by_server_at
            });
            _this.emitter.onServerSendChat(emitData);
        });
    };
    /**
     * User receive chat, so server can send notification to sender that
     * this user was receive the message and app change status to "RECEIVED" or
     * double checklist like in WhatsApp
     * @param data chat data, which contains
     * @var conversation_id => Id of conversation / message
     * @var sender_id => Id of sender the conversation message
     */
    ChatEventReceiver.prototype.onReceiveChat = function (data) {
        if (this.isAnonymous())
            return;
        var params = {
            'conversation_id': data.conversation_id
        };
        this.repository.receiveMessage(params, function (_) {
            //this.emitter.onServerNotifyMessageReceived(data);
        });
    };
    /**
     * User read all chat sent from sender, then
     * server can send notification to sender that this user was read the message
     * and app change status to "READ" or double checklist blue like in WhatsApp
     *
     * @param data chat data, which contains
     * @var sender_id => Id of message sender
     */
    ChatEventReceiver.prototype.onReadChat = function (data) {
        if (this.isAnonymous())
            return;
        var readAt = this.millisecondSinceEpoch();
        var params = {
            'sender_id': data.sender_id,
            'receiver_id': this.idUser,
            'read_at': readAt,
        };
        this.repository.readAllMessage(params, function (r) {
            //this.emitter.onServerNotifyMessageRead(params);
        });
    };
    /**
     * Get undelivered message to this user, this may happens when sender sends message
     * while this user offline
     *
     * @param callback, called with parameter
     *  @param data => List of undelivered message
     */
    ChatEventReceiver.prototype.onAskingForDelayedMessage = function (callback) {
        if (this.isAnonymous())
            return;
        this.repository.askForDelayedMessage(this.idUser, function (r) {
            /**r.data.forEach((it) => {
                it.conversation = Decrypt(it.conversation);

                let emitData = {
                    'sender_url_id' : it.sender_url_id,
                    'conversation_id' : it.id_conversation,
                    'received_by_target_at' : it.received_by_target_at
                };
                this.emitter.onServerNotifyDelayedMessageReceived(emitData);
            });

            if(r.data.length > 0){
                callback(classToPlain(r));
            }*/
        });
    };
    /**
     * Get latest message status which sent from this user,
     * cause maybe the receiver has received / read messages when this user
     * goes offline
     *
     * @param data => List of message that want to see latest status of the message, which contains
     * @var data => Object of list, which contains
     *  @var conversation_id => Id of message
     *
     * @param callback, called with parameter
     *  @param data => List of message with latest status, which contains
     *  @var conversation_id => Id of message
     *  @var status => Status of message (SENT / READ), then the UI will update with the latest status
     *  @var sent_at => Time when receiver get the message, value as Milliseconds since epoch
     *  @var read_at => Time when receiver read the message, value as Milliseconds since epoch
     */
    ChatEventReceiver.prototype.onAskingForLatestReportMessage = function (data, callback) {
        if (this.isAnonymous())
            return;
        this.repository.askForLatestStatusMessage(data, function (r) {
            callback(r);
        });
    };
    /**
     * Update offline status
     *
     * Called when user log out
     * or app closed
     *
     * Leaving school room
     *
     * Remove from Connected Cache
     *
     * Store to Inactive Cache
     *
     */
    ChatEventReceiver.prototype.onDisconnect = function () {
        var _this = this;
        if (this.isAnonymous())
            return;
        var params = {
            'id_user': this.idUser,
            'socket_id': this.socket.id,
        };
        this.repository.offline(params, function (res) {
            _this.broadcaster.broadcastOffline(res);
            Global_1.ConnectedUserCache.del(_this.idUser);
            Global_1.InactiveUserCache.del(_this.idUser);
        });
    };
    return ChatEventReceiver;
}(BaseEventHandler_1.default));
exports.default = ChatEventReceiver;
