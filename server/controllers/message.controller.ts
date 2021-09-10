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
import { MessageCreateDTO, SupportDTO } from '../dto'
import { getRepository, getConnection } from 'typeorm';
import { MycoidMessage, MycoidChat } from '../entities';
import { Status } from '../enum';
import { paginate, generatePasscode } from '../util';
import { Utils } from 'handlebars';
import { sendMail } from '../mail';
import { UserType } from '../enum/userType.enum';

@Controller('/message')
export class MessageController {
  // All Message details
  @Get('/all')
  @Middleware([authenticateMiddleware])
  public async index(request: Request, response: Response, next: NextFunction) {
    let Id = parseInt(request.params.id);
    //var { currentPage, maxPages, pageSize } = request.query;
    var currentPage, maxPages, pageSize;
    currentPage = request.query.currentpage;
    maxPages = request.query.maxPages;
    pageSize = request.query.pageSize;
    currentPage = currentPage ? currentPage : 1;
    maxPages = maxPages ? maxPages : 1;
    pageSize = pageSize && pageSize <= 100 ? pageSize : 10;
    const productCountQuery = await MycoidMessage.count();
    if (productCountQuery) {
      const paginationData = paginate(
        productCountQuery,
        parseInt(currentPage),
        parseInt(pageSize),
        parseInt(maxPages),
      );

      let PaginationQuery;
      PaginationQuery = await getRepository(MycoidMessage)
        .createQueryBuilder('mycoid_message')
        .select(['mycoid_message.message',
        'mycoid_message.createdDatetime',
        'mycoid_message.messageId',
        'mycoid_message.branchuserId',
        'mycoidBranch.branchId',
        'mycoidBranch.branchName',
        'mycoidBranchUser.firstName',
        'mycoidBranchUser.lastName',
        'mycoidBranchUser.email',
      ])
        .leftJoin('mycoid_message.mycoidBranchUser', 'mycoidBranchUser')
        .leftJoin('mycoid_message.mycoidBranch', 'mycoidBranch')
        .where(`mycoid_message.status In (:...status)`, { status: [Status.ACTIVIE, Status.INACTIVE] })
        .skip(paginationData.startIndex)
        .take(paginationData.pageSize)
        .orderBy('mycoid_message.messageId', 'DESC')
        .getMany();
      let result = [];
      PaginationQuery.map(function (message, index) {

        result.push(message);
      }, this);
      //  console.log(result);
      response.status(200).json({
        status: 200,
        timestamp: Date.now(),
        message: 'All Details Fetched Successfully',
        response: {
          ...paginationData,
          ...{ data: result },
        },
      });
    }
    else {
      next(new CommonException('404', 'No Record Found'));
    }
  }




  @Get('/:id')
  @Middleware([authenticateMiddleware])
  public async getItem(request: Request,
    response: Response,
    next: NextFunction) {
    let Id = parseInt(request.params.id);
    let data;
    const getMessageQuery = await getRepository(MycoidMessage)
      .createQueryBuilder('mycoid_message')
      .select(['mycoid_message.message',
      'mycoid_message.createdDatetime',
      'mycoid_message.messageId',
      'mycoid_message.branchuserId',
      'mycoidBranch.branchId',
      'mycoidBranch.branchName',
      'mycoidBranchUser.firstName',
      'mycoidBranchUser.lastName',
      'mycoidBranchUser.email',
    ])
      .leftJoin('mycoid_message.mycoidBranchUser', 'mycoidBranchUser')
      .leftJoin('mycoid_message.mycoidBranch', 'mycoidBranch')
      .where(
        'mycoid_message.messageId = :id  AND mycoid_message.status In (:...status)',
        {
          id: Id,
          status: [Status.ACTIVIE, Status.INACTIVE],

        },
      )
      .getOne();
    if (getMessageQuery) {
      response.status(200).json({
        status: 200,
        timestamp: Date.now(),
        message: 'Message data',
        success: true,
        response: { ...getMessageQuery },
      });
    } else {
      next(new CommonException('404', 'No Record Found'));
    }
  }
  // branch based data
  @Get('/branch/:id')
  @Middleware(authenticateMiddleware)

  public async getBranchItem(request: Request, response: Response, next: NextFunction) {
    let Id = parseInt(request.params.id);
    //var { currentPage, maxPages, pageSize } = request.query;
    var currentPage, maxPages, pageSize;
    currentPage = request.query.currentpage;
    maxPages = request.query.maxPages;
    pageSize = request.query.pageSize;
    currentPage = currentPage ? currentPage : 1;
    maxPages = maxPages ? maxPages : 1;
    pageSize = pageSize && pageSize <= 100 ? pageSize : 10;
    const productCountQuery = await getRepository(MycoidMessage)
      .createQueryBuilder('mycoid_message')
      .where('mycoid_message.branch_id = :id',
        { id: Id })
      .getCount();
    if (productCountQuery) {
      const paginationData = paginate(
        productCountQuery,
        parseInt(currentPage),
        parseInt(pageSize),
        parseInt(maxPages),
      );

      let PaginationQuery;
      PaginationQuery = await getRepository(MycoidMessage)
        .createQueryBuilder('mycoid_message')
        .where(`mycoid_message.branch_id = :id`, { id: Id })
        .skip(paginationData.startIndex)
        .take(paginationData.pageSize)
        .orderBy('message_id', 'DESC')
        .getMany();
      let result = [];
      PaginationQuery.map(function (message, index) {

        result.push(message);
      }, this);
      //  console.log(result);
      response.status(200).json({
        status: 200,
        timestamp: Date.now(),
        message: 'All Details Fetched Successfully',
        response: {
          ...paginationData,
          ...{ data: result },
        },
      });
    }
    else {
      next(new CommonException('404', 'No Record Found'));
    }
  }
  // branch based data
  @Get('/user/:id')
  @Middleware(authenticateMiddleware)
  public async getUserItem(request: Request, response: Response, next: NextFunction) {
    let Id = parseInt(request.params.id);
    // var { currentPage, maxPages, pageSize } = request.query;
    var currentPage, maxPages, pageSize;
    currentPage = currentPage ? currentPage : 1;
    maxPages = maxPages ? maxPages : 1;
    pageSize = pageSize && pageSize <= 100 ? pageSize : 10;
    const productCountQuery = await getRepository(MycoidMessage)
      .createQueryBuilder('mycoid_message')
      .where('mycoid_message.user_id = :id',
        { id: Id })
      .getCount();
    if (productCountQuery) {
      const paginationData = paginate(
        productCountQuery,
        parseInt(currentPage),
        parseInt(pageSize),
        parseInt(maxPages),
      );

      let PaginationQuery;
      PaginationQuery = await getRepository(MycoidMessage)
        .createQueryBuilder('mycoid_message')
        .where(`mycoid_message.user_id = :id`, { id: Id })
        .skip(paginationData.startIndex)
        .take(paginationData.pageSize)
        .orderBy('message_id', 'DESC')
        .getMany();
      let result = [];
      PaginationQuery.map(function (message, index) {

        result.push(message);
      }, this);
      //  console.log(result);
      response.status(200).json({
        status: 200,
        timestamp: Date.now(),
        message: 'All Details Fetched Successfully',
        response: {
          ...paginationData,
          ...{ data: result },
        },
      });
    }
    else {
      next(new CommonException('404', 'No Record Found'));
    }
  }
  // Customer based data
  @Get('/customer/:id')
  @Middleware(authenticateMiddleware)

  public async getCustomerItem(request: Request, response: Response, next: NextFunction) {
    let Id = parseInt(request.params.id);
    //var { currentPage, maxPages, pageSize } = request.query;
    var currentPage, maxPages, pageSize;
    currentPage = request.query.currentpage;
    maxPages = request.query.maxPages;
    pageSize = request.query.pageSize;
    currentPage = currentPage ? currentPage : 1;
    maxPages = maxPages ? maxPages : 1;
    pageSize = pageSize && pageSize <= 100 ? pageSize : 10;
    const productCountQuery = await getRepository(MycoidMessage)
      .createQueryBuilder('mycoid_message')
      .where('mycoid_message.customer_id = :id',
        { id: Id })
      .getCount();
    if (productCountQuery) {
      const paginationData = paginate(
        productCountQuery,
        parseInt(currentPage),
        parseInt(pageSize),
        parseInt(maxPages),
      );

      let PaginationQuery;
      PaginationQuery = await getRepository(MycoidMessage)
        .createQueryBuilder('mycoid_message')
        .where(`mycoid_message.customer_id = :id`, { id: Id })
        .skip(paginationData.startIndex)
        .take(paginationData.pageSize)
        .orderBy('message_id', 'DESC')
        .getMany();
      let result = [];
      PaginationQuery.map(function (message, index) {

        result.push(message);
      }, this);
      //  console.log(result);
      response.status(200).json({
        status: 200,
        timestamp: Date.now(),
        message: 'All Details Fetched Successfully',
        response: {
          ...paginationData,
          ...{ data: result },
        },
      });
    }
    else {
      next(new CommonException('404', 'No Record Found'));
    }
  }

  @Post('/support')
  @Middleware([validationMiddleware(SupportDTO)])
  private async support(request: Request, response: Response, next: NextFunction) {
    const { firstName, lastName, email, company, message }: SupportDTO = request.body;
    sendMail(
      '../template/customerRequest.hbs',
      process.env.SUPPORT_EMAIL,
      'Customer request',
      {
        firstName,
        lastName,
        email,
        company,
        message
      },
    );
    response.status(200).json({
      status: 200,
      timestamp: Date.now(),
      message: 'Message send successfully.',
      response: {  },
  });
  }
  // message remove
  @Post('/remove/:id')
  @Middleware([authenticateMiddleware])
  private async removeMessage(request: Request, response: Response, next: NextFunction,) {
    let Id = parseInt(request.params.id);
    try {
      const updateQuery = await getRepository(MycoidMessage)
        .delete({ messageId: Id });
      response.status(200).json({
        status: 200,
        timestamp: Date.now(),
        message: 'Message remove Successfully.',
        response: { updateQuery },
      });
    } catch (error) {
      //console.log(error);
      next(new InternalServerErrorException(error));
    }
  }
   // Addd Branch 
   @Post('/add')
   @Middleware([validationMiddleware(MessageCreateDTO), authenticateMiddleware])
   public async createMessage(request: Request, response: Response, next: NextFunction,) {
     try {
       const {
        visitors,
         message,
       }: MessageCreateDTO = request.body;
       console.log('request.body;',request.body)
       let customers=[];
       for(let i=0;i<visitors.length;i++){
        customers.push(visitors[0].customerId);
        await getRepository(MycoidChat).save({
          senderUserType: UserType.BRANCHUSER,
          senderId:visitors[i].branchuserId,
          message: message,
          receiverUserType: UserType.CUSTOMER,
          receiverId:  visitors[i].customerId,
        });
       }
       const createMessageQuery = await getRepository(MycoidMessage)
           .createQueryBuilder('mycoid_message')
           .insert()
           .into('mycoid_message')
           .values({
           ...{ userId: visitors[0].userId, branchId: visitors[0].branchId, branchuserId: visitors[0].branchuserId, customerId: customers.join(','), message: message, status:Status.ACTIVIE, createdDatetime: new Date(), createdby : visitors[0].createdBy},
           })
           .execute();
           const brancAdedid = createMessageQuery.identifiers[0].id;
          
           response.status(200).json({
           status: 200,
           timestamp: Date.now(),
           message: 'Message added successfully.',
           response: {
             id: createMessageQuery.generatedMaps[0].messageId,
             
            },
         });
         
     } catch (error) {
       next(new InternalServerErrorException(error));
     }
   } 
//  @Post('/update/:id')
//   //@Middleware([validationMiddleware(UpdateCustomerDTO), authenticateMiddleware])
//   @Middleware(validationMiddleware(UpdateBranchDTO))
//   private async updateBranch(
//     request: Request,
//     response: Response,
//     next: NextFunction,
//   ) {
//     try {
//       let Id = parseInt(request.params.id);
//       const {
//         id,
//         branchName,
//         telephone,
//          email,
//          website,
//          address,
//          postcode,
//          city,
//          place,
//          country,
//          branchStatus,
//          modifiedBy
//       }: UpdateBranchDTO = request.body;
      
//       const updateQuery = await getRepository(MycoidBranch)
//             .createQueryBuilder('mycoid_branch')
//             .update()
//             .set({branchName: branchName, telephone: telephone, email: email, website: website, address: address, postcode: postcode, place: place, city: city, country: country,  modifiedDatetime: new Date(), modifiedby : modifiedBy, status:branchStatus,})
//             .where('mycoid_branch.branch_id=:id',{ id: Id},)
//             .execute();
//             response.status(200).json({
//                 status: 200,
//                 timestamp: Date.now(),
//                 message: 'Branch Update Successfully.',
//                 response: { updateQuery },
//             }); 
//     } catch (error) {
//       //console.log(error);
//       next(new InternalServerErrorException(error));
//     }
//   }

}
export default MessageController