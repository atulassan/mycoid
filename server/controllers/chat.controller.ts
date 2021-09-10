import { Request, Response, NextFunction } from 'express'
import { Controller, Get, Post, Middleware } from '../decorators'
import { validationMiddleware, authenticateMiddleware } from '../middleware'
import {
  UserWithThatEmailAlreadyExistsException,
  InternalServerErrorException,
  UserMobileAlreadyExists,
  CommonException,
  PasswordNotMatchException,

} from '../exceptions/index';
import { CheckinDTO, CheckoutDTO } from '../dto'
import { getRepository, getConnection } from 'typeorm';
import { MycoidChat,MycoidUsers } from '../entities';
import { Status } from '../enum';
import { paginate, generatePasscode } from '../util';
import { Utils } from 'handlebars';
//import * as socketio from "socket.io";
//import * as io from "../server";




@Controller('/chat')
export class ChatController {

 @Get('/user/:type/:id') //any type users (admin, branchuser,customer, )
 //@Middleware([authenticateMiddleware])
 public async index(request: Request, response: Response, next: NextFunction) {
    let userId = parseInt(request.params.id);
    let userType = request.params.type;
    //var { currentPage, maxPages, pageSize } = request.query;
    var currentPage, maxPages, pageSize ;
    currentPage = request.query.currentpage;
    maxPages = request.query.maxPages;
    pageSize = request.query.pageSize;
    currentPage = currentPage ? currentPage : 1;
    maxPages = maxPages ? maxPages : 1;
    pageSize = pageSize && pageSize <= 100 ? pageSize : 10;
    const chat = getRepository(MycoidChat);

  //   const productCountQuery = await await getRepository(MycoidChat)
  //   .createQueryBuilder('mycoid_chatt')
  //   .where(
  //     userType=='CUSTOMER'?'customer_id':'branchuser_id=:userId', //user_type=:userType  AND 
  //     {
  //       userId: userId,
  //     },
  //   ).orderBy('created_datetime','ASC')
  //   .getMany()
  //  console.log('productCountQuery',productCountQuery)
      //  console.log(result);
      response.status(200).json({
        status: 200,
        timestamp: Date.now(),
        message: 'All Details Fetched Successfully',
        response: {
          ...{ data: [] },
        },
      });
    //}
    // else {
    //   next(new CommonException('404', 'No Record Found'));
    // }
  }
}