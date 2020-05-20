import axios, { AxiosResponse } from 'axios';
import { plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';
import BaseResponse from './BaseResponse';
import { logger } from '../global/Global';
import ResponseException from '../network/exception/ResponseException';

export default class BaseRepository {
    baseUrl: string;

    constructor(baseUrl:string = ""){
        this.baseUrl = baseUrl;
    }

    protected get<T extends BaseResponse>(targetClass: ClassType<T>, path: string, callback: (response: T) => void) : void {
        axios.get<string>(`${this.baseUrl}/${path}`)
        .then((response: AxiosResponse<string>) => {
            let resObj = plainToClass(targetClass, response.data);
            if(resObj.status){
                logger.info(`GET Request to = ${path} success with result ${JSON.stringify(response.data)}`);
                callback(resObj);
            }else {
                throw new ResponseException(`Response Exception : ${resObj.message}, Full response : ${JSON.stringify(response.data)}`);
            }
        })
        .catch((error) => {
            if(error instanceof ResponseException){
                logger.warn(`GET Request to = ${path} failed with result ${error.message}`);
            }else {
                logger.error(`GET Request to = ${path} failed with result ${error}`);
            }
        });
    }

    protected post<T extends BaseResponse>(targetClass: ClassType<T>, path: string, 
        params?: {}, callback?: (response: T) => void) : void {
        axios.post<string>(`${this.baseUrl}/${path}`, params)
        .then((response: AxiosResponse<string>) => {
            let resObj = plainToClass(targetClass, response.data);
            if(resObj.status){
                logger.info(`POST Request to = ${path} with parameter ${JSON.stringify(params)} success with result ${JSON.stringify(response.data)}`);
                callback?.(resObj);
            }else {
                throw new ResponseException(`Response Exception : ${resObj.message}, Full response : ${JSON.stringify(response.data)}`);
            }
        })
        .catch((error) => {
            if(error instanceof ResponseException){
                logger.warn(`POST Request to = ${path} with parameter ${JSON.stringify(params)} failed with result ${error.message}`);
            }else {
                logger.error(`POST Request to = ${path} with parameter ${JSON.stringify(params)} failed with result ${error}`);
            }
        });
    }
}