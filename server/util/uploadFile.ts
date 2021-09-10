import { Request, Response, NextFunction } from 'express'
import boy from 'busboy';
import moment from 'moment';
import path from 'path';
import fs from 'fs';
import mkdirp from 'mkdirp';
import {
  UnsupportedImageFormatException,

} from '../exceptions/index';

export function uploadImages(request: Request, response: Response) {
  return new Promise((resolve, reject) => {
    const busboy = new boy({ headers: request.headers });
    const fileId = moment.now().toString();
    const folderForImage = `uploads/images/`;
    !fs.existsSync(folderForImage)
      ? (mkdirp.sync(path.resolve(folderForImage)),
        fs.chmodSync(path.resolve(folderForImage), '0755'))
      : null;
    var fileFired = 0;
    let sendMess;
    let saveImage;
    let fileType;
    let error: boolean = false;
    busboy.on('file', async function (
      fieldname,
      file,
      filename,
      encoding,
      mimetype
    ) {
      fileFired = 1;
      console.log('mimetypemimetypemimetype===', file, mimetype)
      fileType = mimetype;
      if (mimetype == 'image/png' || mimetype == 'image/jpeg' || mimetype == 'image/jpg') {
        saveImage = await path.join(
          folderForImage,
          `${fileId}.${mimetype.split('/')[1]}`,
        );
        await file.pipe(fs.createWriteStream(saveImage));
        sendMess = { "status": 200, "upload": 1, "saveImage": saveImage, "error": false };
      } else {
        file.resume();
        error = true;
        sendMess = { "status": 200, "upload": 2, "saveImage": saveImage, "error": false };
      }
      resolve(sendMess)
    });
    setTimeout(function () {
      if (!fileFired) {
        resolve({ "status": 200, "error": true })
      }
    }, 1000)
    // busboy.on('finish', function() {
    //       console.log('Upload complete');
    //       resolve(sendMess)
    //   });

    request.pipe(busboy)

  })
}




//  let dataSize;
//         let busboy = new boy({ headers: req.headers });
//         busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
//             file.on('data', function (data) {
//                 dataSize = data.length;
//                 console.log("File [" + fieldname + "] got " + data.length + " bytes");
//             })
//         });
//         busboy.on('finish', function() {
//             console.log('Upload complete');
//             resolve(dataSize)
//         });
//         req.pipe(busboy)