"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Receiver_1 = __importDefault(require("./chat/Receiver"));
var ChatAction = /** @class */ (function () {
    function ChatAction() {
    }
    ChatAction.SOMEONE_ONLINE = 'someone online';
    ChatAction.SOMEONE_OFFLINE = 'someone offline';
    ChatAction.SOMEONE_SEND_MESSAGE = 'someone send you message';
    ChatAction.TARGET_RECEIVE_MESSAGE = 'target receive your message';
    ChatAction.TARGET_RECEIVE_DELAYED_MESSAGE = 'target receive your delayed message';
    ChatAction.TARGET_READ_MESSAGE = 'target read your message';
    ChatAction.SOMEONE_TYPING = 'someone typing';
    return ChatAction;
}());
exports.ChatAction = ChatAction;
var ChatEvent = /** @class */ (function () {
    function ChatEvent() {
    }
    ChatEvent.CONNECTED = 'connection';
    ChatEvent.TYPING = 'i\'m typing';
    ChatEvent.SENDING_MESSAGE = 'i\'m sending message';
    ChatEvent.RECEIVING_MESSAGE = 'i\'m receiving message';
    ChatEvent.ASK_FOR_DELAYED_MESSAGE = 'give me my delayed message';
    ChatEvent.ASK_FOR_UPDATED_MESSAGE_REPORT = 'give me my latest report message message';
    ChatEvent.READING_MESSAGE = 'i\'m reading message';
    ChatEvent.GO_TO_FOREGROUND = 'i\'m going to foreground';
    ChatEvent.GO_TO_BACKGROUND = 'i\'m going to background';
    ChatEvent.DISCONNECTED = 'disconnect';
    return ChatEvent;
}());
exports.ChatEvent = ChatEvent;
function registerChatEventHandler(socket, server) {
    return new Receiver_1.default(socket, server);
}
exports.registerChatEventHandler = registerChatEventHandler;
