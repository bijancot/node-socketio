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
var BaseRepository_1 = __importDefault(require("../../parents/BaseRepository"));
var BaseResponse_1 = __importDefault(require("../../parents/BaseResponse"));
var Global_1 = require("../../global/Global");
var ExitChatResponse_1 = __importDefault(require("../response/ExitChatResponse"));
var InsertConversationResponse_1 = __importDefault(require("../response/InsertConversationResponse"));
var Repository = /** @class */ (function (_super) {
    __extends(Repository, _super);
    function Repository() {
        return _super.call(this, Global_1.config.base_url) || this;
    }
    /**
     * Update status online in db
     * @param params => Parameter to process in API
     * @param callback => Callback of success
     */
    Repository.prototype.online = function (params, callback) {
        this.post(BaseResponse_1.default, 'chat/online', params, callback);
    };
    /**
     * Update status offline in db
     * @param params => Parameter to process in API
     * @param callback => Callback of success
     */
    Repository.prototype.offline = function (params, callback) {
        this.post(ExitChatResponse_1.default, 'chat/offline', params, callback);
    };
    /**
     * Insert message to db and
     * Get information of sender (id, name, photo) that will be send to receiver
     * @param params => Parameter to process in API, which contains
     * @var conversation_id => Unique ID generated from App
     * @var sender_url_id => Id of sender user
     * @var receiver_url_id => Id of receiver user
     * @var conversation => Encrypted Message
     * @var send_at => Time when user trying to send the message, cause maybe there will be
     * a delay either no internet connection, so sender cannot send that message at that time,
     * app should check periodically and send message automatically when internet connection established
     * @var target_url_id => Receiver Id
     *
     * @param callback => Callback of success
     */
    Repository.prototype.insertConversation = function (params, callback) {
        this.post(InsertConversationResponse_1.default, "chat/conversation/send", params, callback);
    };
    /**
     * Update conversation status to 2 (RECEIVED)
     * @param params => Parameter to process in API, which contains
     * @var conversation_id => Id of conversation / message
     *
     * @param callback => Callback of success
     */
    Repository.prototype.receiveMessage = function (params, callback) {
        this.post(BaseResponse_1.default, "chat/conversation/received", params, callback);
    };
    /**
     * Update conversation status to 2 (RECEIVED)
     * @param params => Parameter to process in API, which contains
     * @var sender_id => Id of message sender
     * @var receiver_id => Id of receiver (current user)
     * @var read_at => Date Time yyyy-MM-dd HH:mm:ss / This server time
     *
     * @param callback => Callback of success
     */
    Repository.prototype.readAllMessage = function (params, callback) {
        this.post(BaseResponse_1.default, "chat/conversation/read", params, callback);
    };
    /**
     * Get delayed message from API for this user
     * @param receiverId => Receiver ID, in this case this user ID
     * @param callback => Callback of success
     */
    Repository.prototype.askForDelayedMessage = function (receiverId, callback) {
        this.post(BaseResponse_1.default, "chat/delayed/message/" + receiverId, undefined, callback);
    };
    /**
     * Get latest status message from API which sent by this user
     * @param params => Parameter to process in API, which contains
     * @var data => Object of list, which contains
     *  @var conversation_id => Id of message
     *
     * @param callback => Callback of success
     */
    Repository.prototype.askForLatestStatusMessage = function (params, callback) {
        this.post(BaseResponse_1.default, "chat/latest/status", { 'messages': JSON.stringify(params) }, callback);
    };
    return Repository;
}(BaseRepository_1.default));
exports.default = Repository;
