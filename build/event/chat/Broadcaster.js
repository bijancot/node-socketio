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
var ChatEventBroadcaster = /** @class */ (function (_super) {
    __extends(ChatEventBroadcaster, _super);
    function ChatEventBroadcaster() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Broadcast to all user that this person is online,
     * so they can update last seen status
     *
     * @emits event @see ChatAction.SOMEONE_ONLINE as Event name
     * @emits data to whole user in same school, which contains
     * @var message => Optional
     * @var id_user => This user id
     */
    ChatEventBroadcaster.prototype.broadcastOnline = function () {
        this.socket.broadcast.emit(__1.ChatAction.SOMEONE_ONLINE, {
            'message': 'Hey guys, i\'m online',
            'id_user': this.idUser
        });
    };
    /**
     * Broadcast to all user that this person is offline,
     * so they can update last seen status
     *
     * @param response => passed data when success request to API
     * @see ChatEventReceiver.onDisconnect()
     *
     * @emits event @see ChatAction.SOMEONE_OFFLINE as Event name
     * @emits data to whole user in same school, which contains
     * @var message => Optional
     * @var last_online => Last Online of this user
     * @var id_user => This user id
     *
     */
    ChatEventBroadcaster.prototype.broadcastOffline = function (response) {
        this.socket.broadcast.emit(__1.ChatAction.SOMEONE_OFFLINE, {
            'message': 'Hey guys, i\'ll be back later',
            'last_logout': response.last_online,
            'id_user': this.idUser
        });
    };
    return ChatEventBroadcaster;
}(BaseEventHandler_1.default));
exports.default = ChatEventBroadcaster;
