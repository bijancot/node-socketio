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
var __1 = require("..");
var BaseEventHandler_1 = __importDefault(require("../../parents/BaseEventHandler"));
var Global_1 = require("../../global/Global");
var ChatEventEmitter = /** @class */ (function (_super) {
    __extends(ChatEventEmitter, _super);
    function ChatEventEmitter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
    * This user send typing notification to interlocutor
    * @param data, data passed from @see ChatEventReceiver_onTyping() which contains
    * @var target_id => Interlocutor id,
    *
    * @emits event @see ChatAction.SOMEONE_TYPING as Event name
    * @emits data to target which contains
    * @var from_id => Current User Id
    */
    ChatEventEmitter.prototype.onUserSendTypingNotif = function (data) {
        if (!Global_1.ConnectedUserCache.has(data.target_id))
            return;
        var targetSocketId = Global_1.ConnectedUserCache.get(data.target_id);
        this.socket.to(targetSocketId).emit(__1.ChatAction.SOMEONE_TYPING, {
            'from_id': this.idUser,
        });
    };
    /**
     * Server sends chat to target
     * @param data, data retrieved from API after successful insertion, which contains
     * @var conversation_id => ID of conversation
     * @var sender_id => Sender ID
     * @var receiver_id => Receiver ID
     * @var conversation => The message
     * @var received_by_server_at => Time when message retrieved by server
     * @var sender.display_id_url => Url Id of sender
     * @var sender.display_name => Name of sender
     * @var sender.display_foto => Photo of sender
     *
     * @emits event @see ChatAction.SOMEONE_SEND_MESSAGE as Event name
     * @emits data => @param data
     */
    ChatEventEmitter.prototype.onServerSendChat = function (data) {
        if (!Global_1.ConnectedUserCache.has(data.receiver_id))
            return;
        var receiverSocket = Global_1.ConnectedUserCache.get(data.receiver_id);
        this.server.to(receiverSocket).emit(__1.ChatAction.SOMEONE_SEND_MESSAGE, data);
    };
    return ChatEventEmitter;
}(BaseEventHandler_1.default));
exports.default = ChatEventEmitter;
