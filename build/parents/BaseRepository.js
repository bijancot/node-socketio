"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var class_transformer_1 = require("class-transformer");
var Global_1 = require("../global/Global");
var ResponseException_1 = __importDefault(require("../network/exception/ResponseException"));
var BaseRepository = /** @class */ (function () {
    function BaseRepository(baseUrl) {
        if (baseUrl === void 0) { baseUrl = ""; }
        this.baseUrl = baseUrl;
    }
    BaseRepository.prototype.get = function (targetClass, path, callback) {
        axios_1.default.get(this.baseUrl + "/" + path)
            .then(function (response) {
            var resObj = class_transformer_1.plainToClass(targetClass, response.data);
            if (resObj.status) {
                Global_1.logger.info("GET Request to = " + path + " success with result " + JSON.stringify(response.data));
                callback(resObj);
            }
            else {
                throw new ResponseException_1.default("Response Exception : " + resObj.message + ", Full response : " + JSON.stringify(response.data));
            }
        })
            .catch(function (error) {
            if (error instanceof ResponseException_1.default) {
                Global_1.logger.warn("GET Request to = " + path + " failed with result " + error.message);
            }
            else {
                Global_1.logger.error("GET Request to = " + path + " failed with result " + error);
            }
        });
    };
    BaseRepository.prototype.post = function (targetClass, path, params, callback) {
        axios_1.default.post(this.baseUrl + "/" + path, params)
            .then(function (response) {
            var resObj = class_transformer_1.plainToClass(targetClass, response.data);
            if (resObj.status) {
                Global_1.logger.info("POST Request to = " + path + " with parameter " + JSON.stringify(params) + " success with result " + JSON.stringify(response.data));
                callback === null || callback === void 0 ? void 0 : callback(resObj);
            }
            else {
                throw new ResponseException_1.default("Response Exception : " + resObj.message + ", Full response : " + JSON.stringify(response.data));
            }
        })
            .catch(function (error) {
            if (error instanceof ResponseException_1.default) {
                Global_1.logger.warn("POST Request to = " + path + " with parameter " + JSON.stringify(params) + " failed with result " + error.message);
            }
            else {
                Global_1.logger.error("POST Request to = " + path + " with parameter " + JSON.stringify(params) + " failed with result " + error);
            }
        });
    };
    return BaseRepository;
}());
exports.default = BaseRepository;
