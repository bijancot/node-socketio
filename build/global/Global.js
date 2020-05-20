"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_json_1 = __importDefault(require("./config.json"));
var winston_1 = require("winston");
var winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var node_cache_1 = __importDefault(require("node-cache"));
require('dotenv').config();
var jsonConfig = JSON.parse(JSON.stringify(config_json_1.default));
/**
 * Global config variable,
 * you can see config variable in
 * @file ./config.json
 */
exports.config = jsonConfig[process.env.ENVIRONMENT || ''];
var logPath = process.env.PWD + "/" + exports.config['log_path'];
if (!fs_1.default.existsSync(logPath)) {
    fs_1.default.mkdirSync(logPath);
}
/**
 * Create log file
 * Log File stored in @file project_path/log/{environment}/yyyy-MM-dd-HH.log
 */
exports.logger = winston_1.createLogger({
    level: exports.config['log_level'],
    format: winston_1.format.combine(winston_1.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }), winston_1.format.printf(function (info) { return info.timestamp + " " + info.level + ": " + info.message; })),
    transports: [
        new winston_1.transports.Console({
            level: exports.config['log_level'],
            format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.printf(function (info) { return info.timestamp + " " + info.level + ": " + info.message; }))
        }),
        new winston_daily_rotate_file_1.default({
            filename: path_1.default.join(logPath, '%DATE%' + exports.config['log_filename']),
            datePattern: 'YYYY-MM-DD',
        })
    ]
});
/**
 * Cache to store connected user
 * Connected Socket ID stored for 1 day if not replaced with new socket id
 */
exports.ConnectedUserCache = new node_cache_1.default({ stdTTL: 24 * 60 * 60, checkperiod: 24 * 60 * 60 });
/**
 * Cache to store afk user / when app in background
 * when receive message while user in inactive state / app in background
 * server sends push notif to receiver,
 * Inactive Socket ID stored for 1 day if not replaced with new socket id
 */
exports.InactiveUserCache = new node_cache_1.default({ stdTTL: 24 * 60 * 60, checkperiod: 24 * 60 * 60 });
