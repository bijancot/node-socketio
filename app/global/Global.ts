import cfg from './config.json';
import { createLogger, format, transports } from 'winston';
import DailyFile from 'winston-daily-rotate-file';
import Fs from 'fs';
import Path from 'path';
import NodeCache from "node-cache";
import crypto from 'crypto';
require('dotenv').config()

var jsonConfig = JSON.parse(JSON.stringify(cfg));
/**
 * Global config variable,
 * you can see config variable in 
 * @file ./config.json
 */
export const config: any = jsonConfig[process.env.ENVIRONMENT || ''];

const logPath: string = `${process.env.PWD}/${config['log_path']}`;

if(!Fs.existsSync(logPath)){
    Fs.mkdirSync(logPath);
}

/**
 * Create log file
 * Log File stored in @file project_path/log/{environment}/yyyy-MM-dd-HH.log
 */
export const logger = createLogger({
    level: config['log_level'],
    format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
      ),
      transports: [
        new transports.Console({
          level: config['log_level'],
          format: format.combine(
            format.colorize(),
            format.printf(
              info => `${info.timestamp} ${info.level}: ${info.message}`
            )
          )
        }),
        new DailyFile({
          filename: Path.join(logPath, '%DATE%'+config['log_filename']),
          datePattern: 'YYYY-MM-DD',
        })
      ]
});

/**
 * Cache to store connected user
 * Connected Socket ID stored for 1 day if not replaced with new socket id
 */
export const ConnectedUserCache = new NodeCache({stdTTL: 24 * 60 * 60, checkperiod: 24 * 60 * 60});

/**
 * Cache to store afk user / when app in background
 * when receive message while user in inactive state / app in background
 * server sends push notif to receiver,
 * Inactive Socket ID stored for 1 day if not replaced with new socket id
 */
export const InactiveUserCache = new NodeCache({stdTTL: 24 * 60 * 60, checkperiod: 24 * 60 * 60});