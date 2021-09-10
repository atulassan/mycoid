import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../exceptions/index';
import { Global } from "../global";
// if(process.env.REDIS_URL!=''){
//     Global.client.on('connect', () => {
//         console.log(`connected to redis`);
//     });
//     Global.client.on('error', err => {
//         console.log(`Error: ${err}`);
//     });
// }
export function redisMiddleware(
    duration: any,
  ) {
    return (request, response, next) => {
        //console.log(request.originalUrl);
   // Global.network = request.headers.network;
        let key =  process.env.REDIS_KEY + Global.network + request.originalUrl || request.url
        Global.client.get(key, function(err, reply){  
            if(reply && duration!=0){
                response.send(JSON.parse(reply));
            }else{
                response.sendResponse = response.send;
                response.send = (body) => {
                    Global.client.set(key, JSON.stringify(body), 'EX', duration, function(err){
                    response.sendResponse(body);
                    });
                }
                next();
            }
        });
    }
}