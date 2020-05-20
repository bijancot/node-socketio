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
var BaseResponse_1 = __importDefault(require("../../parents/BaseResponse"));
/**
 @var received_by_server_at => Time when server received the message
 */
var InsertConversationResponse = /** @class */ (function (_super) {
    __extends(InsertConversationResponse, _super);
    function InsertConversationResponse() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.sender = new InsertConversationSender();
        _this.received_by_server_at = "";
        return _this;
    }
    return InsertConversationResponse;
}(BaseResponse_1.default));
exports.default = InsertConversationResponse;
var InsertConversationSender = /** @class */ (function () {
    function InsertConversationSender() {
        this.id = "";
        this.fullname = "";
        this.email = "";
        this.image = "";
        this.username = "";
    }
    return InsertConversationSender;
}());
