import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import * as express from 'express';
import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../exceptions/index';
import { Global } from "../global";
import { inspect } from 'util';
import { isJson } from '../util/common'
import { uploadImages } from '../util/uploadFile';
var Busboy = require('busboy');

export function validationMiddleware<T>(
  type: any,
  skipMissingProperties = false,
): express.RequestHandler {
  return (request: Request, response: Response, next: NextFunction) => {

    if (request.headers.network) {
      Global.network = request.headers.network as string;
    } else {
      Global.network = 'Testnet';
    }
    if (request.headers['content-type'] && request.headers['content-type'].indexOf('multipart/form-data') > -1) {
      let data = {};
      const busboy = new Busboy({ headers: request.headers });
      const allData = new Promise(async function (resolve, reject) {
        busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
          console.log('Field [' + fieldname + ']: value: ', (val));
          data[fieldname] = val;
          // console.log('datadatadata',data)

        });
        await uploadImages(request, response)
          .then(getalldata => {
             console.log('getalldata===',getalldata)
             if(!getalldata['error']){
                data['uploadedData'] = getalldata;
             }
             else{
              resolve(data)
             }
            busboy.on('finish', function () {
              console.log("SSSSSSSSSSSSS")
              resolve(data)
              // busboy.end(request)
              // request.unpipe(busboy);
            });
            return true;
            // imageData = getalldata['upload'];
            // imageNewLink = getalldata['saveImage'];
          })
          .catch(err => {
            console.log('errr===', err)
          })

        // request['busboy']=busboy;
      });


      request.pipe(busboy);
      // console.log('datadatadata',data)
      allData.then(async function (data) {
        //   console.log('datadatadata',data)
        await Object.keys(data).map(async function (val, ind) {
          if (isJson(data[val])) {
            let tmp = JSON.parse(data[val]);
            request.body = Object.assign(request.body, tmp)
          }
          else {
            request.body[val] = data[val];
          }
        });
        // request.body=data;
        //  console.log('request.body',request.body)
        validate(
          plainToClass(type, {
            ...request.body,
            ...request.query,
            ...request.params,
          }),
          {
            skipMissingProperties,
          },
        ).then((errors: ValidationError[]) => {
          if (errors.length > 0) {
            //removeFile(request.body['file'])
            const message = errors.map((error: ValidationError) =>
              Object.values(error.constraints),
            );
            next(new HttpException(400, message));
          } else {
            next();
          }
        });
      })
      console.log("DDDDDD")
    }
    else {
      validate(
        plainToClass(type, {
          ...request.body,
          ...request.query,
          ...request.params,
        }),
        {
          skipMissingProperties,
        },
      ).then((errors: ValidationError[]) => {
        if (errors.length > 0) {
          const message = errors.map((error: ValidationError) =>
            Object.values(error.constraints),
          );
          next(new HttpException(400, message));
        } else {
          next();
        }
      });
    }
  };
}
