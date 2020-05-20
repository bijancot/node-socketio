"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Repository_1 = __importDefault(require("../network/request/Repository"));
var BaseEventHandler = /** @class */ (function () {
    function BaseEventHandler(socket, server) {
        this.repository = new Repository_1.default();
        this.idUser = socket.handshake.headers['x-lets-connect-id-user'];
        this.socket = socket;
        this.server = server;
    }
    /**
     * Check whether user is anonymous or not
     */
    BaseEventHandler.prototype.isAnonymous = function () { return this.idUser == null; };
    /**
     * Get current date time
     * @return DateTime yyyy-MM-dd HH:mm:ss as String
     */
    BaseEventHandler.prototype.currentDateTime = function () {
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        return date + ' ' + time;
    };
    /**
     * Get current millisecond since epoch
     * @return millisecond since epoch
     */
    BaseEventHandler.prototype.millisecondSinceEpoch = function () {
        return new Date().valueOf();
    };
    return BaseEventHandler;
}());
exports.default = BaseEventHandler;
