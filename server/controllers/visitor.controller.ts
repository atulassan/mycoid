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
import { MycoidVisitor } from '../entities';
import { Status } from '../enum';
import { paginate, generatePasscode } from '../util';
import { Utils } from 'handlebars';

@Controller('/visitor')
export class VisitorController {
  /***
   * All visitor details
   * */
  @Get('/all')
  @Middleware(authenticateMiddleware)
  public async getAllvisitorItem(request: Request, response: Response, next: NextFunction) {
    let Id = parseInt(request.params.id);
    //var { currentPage, maxPages, pageSize } = request.query;
    if (request['user']['userType'] != 'USER')
      return next(new CommonException('401', 'You are not authorized'));
    var currentPage, maxPages, pageSize, search;
    currentPage = request.query.currentpage;
    maxPages = request.query.maxPages;
    pageSize = request.query.pageSize;
    currentPage = currentPage ? currentPage : 1;
    maxPages = maxPages ? maxPages : 1;
    pageSize = pageSize && pageSize <= 100 ? pageSize : 10;
    search = request.query.search ? request.query.search : '';
    let visitorResult = await this.getVisitorHistory(0, { currentPage, pageSize, maxPages }, search,request['user'])
    if (visitorResult) {
      response.status(200).json({
        status: 200,
        timestamp: Date.now(),
        message: 'All Details Fetched Successfully',
        response: {
          ...visitorResult.paginationData,
          ...{ data: visitorResult.result },
        },
      });
    }
    else {
      next(new CommonException('404', 'No Record Found'));
    }
  }
  async getVisitorHistory(branchId: any, pagination: any, search: any,userDetail:any) {
    const productCountQuery = await getRepository(MycoidVisitor).createQueryBuilder('mycoid_visitor')
      .leftJoin('mycoid_visitor.mycoidCustomer', 'mycoidCustomer')
      .leftJoin('mycoid_visitor.mycoidBranch', 'mycoidBranch')
      .leftJoin('mycoid_visitor.mycoidBranchUser', 'mycoidBranchUser')
      .where(`mycoid_visitor.status In (:...status) and (mycoidBranchUser.userId=:userId or mycoidBranchUser.branchuserId=:userId)  ${branchId <= 0 ? ' ' : ' and mycoid_visitor.branch_id =' + branchId} and mycoidCustomer.firstName like :search`, { status: [Status.ACTIVIE, Status.INACTIVE], search: `%${search}%`,userId:userDetail.userId })
      .getCount();

    if (productCountQuery) {
      const paginationData = paginate(
        productCountQuery,
        parseInt(pagination.currentPage),
        parseInt(pagination.pageSize),
        parseInt(pagination.maxPages),
      );

      let PaginationQuery;
      PaginationQuery = await getRepository(MycoidVisitor)
        .createQueryBuilder('mycoid_visitor')
        .leftJoinAndSelect('mycoid_visitor.mycoidCustomer', 'mycoidCustomer')
        .leftJoinAndSelect('mycoid_visitor.mycoidBranch', 'mycoidBranch')
        .leftJoin('mycoid_visitor.mycoidBranchUser', 'mycoidBranchUser')
        .where(`mycoid_visitor.status In (:...status) and (mycoidBranchUser.userId=:userId or mycoidBranchUser.branchuserId=:userId ) ${branchId <= 0 ? ' ' : ' and mycoid_visitor.branch_id =' + branchId} and mycoidCustomer.firstName like :search`, { status: [Status.ACTIVIE, Status.INACTIVE], search: `%${search}%`,userId:userDetail.userId })
        .skip(paginationData.startIndex)
        .take(paginationData.pageSize)
        .orderBy('mycoid_visitor.visitorId', 'DESC')
        .getMany();
      let result = [];

      PaginationQuery.map(function (visitor, index) {
        result.push(this.loadVisitor(visitor));
      }, this);
      //console.log(result);
      return { paginationData, result }
    }
    return false;
  }
  loadVisitor(visitor) {
    if (visitor.mycoidCustomer) {
      delete visitor.mycoidCustomer.password;
      delete visitor.mycoidCustomer.verificationToken;
      delete visitor.mycoidCustomer.status;
      delete visitor.mycoidCustomer.modifiedDatetime;
      delete visitor.mycoidCustomer.forgotToken;
      delete visitor.mycoidCustomer.modifiedby;
      delete visitor.mycoidCustomer.createdDatetime;
      delete visitor.mycoidCustomer.createdby;
    }
    return visitor;
  }
  @Get('/branch/:id')
  @Middleware(authenticateMiddleware)
  public async getAllBranchItem(request: Request, response: Response, next: NextFunction) {
    let Id = parseInt(request.params.id);
    if (!Id || Id == NaN)
      return next(new CommonException('404', 'invalid branch'));
    //var { currentPage, maxPages, pageSize } = request.query;
    var currentPage, maxPages, pageSize, search;
    currentPage = request.query.currentpage;
    maxPages = request.query.maxPages;
    pageSize = request.query.pageSize;
    currentPage = currentPage ? currentPage : 1;
    maxPages = maxPages ? maxPages : 1;
    pageSize = pageSize && pageSize <= 100 ? pageSize : 10;
    search = request.query.search ? request.query.search : '';
    let visitorResult = await this.getVisitorHistory(Id, { currentPage, pageSize, maxPages }, search,request['user'])
    if (visitorResult) {
      response.status(200).json({
        status: 200,
        timestamp: Date.now(),
        message: 'All Details Fetched Successfully',
        response: {
          ...visitorResult.paginationData,
          ...{ data: visitorResult.result },
        },
      });
    }
    else {
      next(new CommonException('404', 'No Record Found'));
    }
  }
  @Get('/user/:id')
  @Middleware(authenticateMiddleware)
  public async getAllUserItem(request: Request, response: Response, next: NextFunction) {
    let Id = parseInt(request.params.id);
    //var { currentPage, maxPages, pageSize } = request.query;
    var currentPage, maxPages, pageSize;
    currentPage = request.query.currentpage;
    maxPages = request.query.maxPages;
    pageSize = request.query.pageSize;
    currentPage = currentPage ? currentPage : 1;
    maxPages = maxPages ? maxPages : 1;
    pageSize = pageSize && pageSize <= 100 ? pageSize : 10;
    const productCountQuery = await getRepository(MycoidVisitor)
      .createQueryBuilder('mycoid_visitor')
      .where('mycoid_visitor.user_id = :id',
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
      PaginationQuery = await getRepository(MycoidVisitor)
        .createQueryBuilder('mycoid_visitor')
        .where(`mycoid_visitor.user_id = :id`, { id: Id })
        .skip(paginationData.startIndex)
        .take(paginationData.pageSize)
        .orderBy('visitor_id', 'DESC')
        .getMany();
      let result = [];
      PaginationQuery.map(function (visitor, index) {
        result.push(visitor);
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
  @Get('/customer/:id')
  @Middleware(authenticateMiddleware)
  public async getAllCustomerItem(request: Request, response: Response, next: NextFunction) {
    let Id = parseInt(request.params.id);
    //var { currentPage, maxPages, pageSize } = request.query;
    var currentPage, maxPages, pageSize;
    currentPage = request.query.currentpage;
    maxPages = request.query.maxPages;
    pageSize = request.query.pageSize;
    currentPage = currentPage ? currentPage : 1;
    maxPages = maxPages ? maxPages : 1;
    pageSize = pageSize && pageSize <= 100 ? pageSize : 10;
    const productCountQuery = await getRepository(MycoidVisitor)
      .createQueryBuilder('mycoid_visitor')
      .where('mycoid_visitor.customerId = :id',
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
      PaginationQuery = await getRepository(MycoidVisitor)
        .createQueryBuilder('mycoid_visitor')
        .leftJoinAndSelect('mycoid_visitor.mycoidBranch', 'mycoidBranch')
        .where(`mycoid_visitor.customerId = :id`, { id: Id })
        .skip(paginationData.startIndex)
        .take(paginationData.pageSize)
        .orderBy('mycoid_visitor.visitorId', 'DESC')
        .getMany();
      let result = [];
      PaginationQuery.map(function (visitor, index) {
        result.push(visitor);
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
  @Middleware(authenticateMiddleware)
  public async getItem(request: Request,
    response: Response,
    next: NextFunction) {
    let Id = parseInt(request.params.id);
    let data;
    const getVisitorQuery = await getRepository(MycoidVisitor)
      .createQueryBuilder('mycoid_visitor')
      .leftJoinAndSelect('mycoid_visitor.mycoidCustomer', 'mycoidCustomer')
      .where(
        'mycoid_visitor.visitor_id = :id  AND mycoid_visitor.status In (:...status)',
        {
          id: Id,
          status: [Status.ACTIVIE, Status.INACTIVE],

        },
      )
      .getOne();
    if (getVisitorQuery) {
      let result = this.loadVisitor(getVisitorQuery);
      response.status(200).json({
        status: 200,
        timestamp: Date.now(),
        message: 'visitor data',
        success: true,
        response: { ...result },
      });
    } else {
      next(new CommonException('404', 'No Record Found'));
    }
  }
  // visitor remove
  @Post('/remove/:id')
  @Middleware([authenticateMiddleware])
  private async removeMessage(request: Request, response: Response, next: NextFunction, ) {
    let Id = parseInt(request.params.id);
    try {
      const updateQuery = await getRepository(MycoidVisitor)
        .delete({ visitorId: Id });
      response.status(200).json({
        status: 200,
        timestamp: Date.now(),
        message: 'visitor remove Successfully.',
        response: { updateQuery },
      });
    } catch (error) {
      //console.log(error);
      next(new InternalServerErrorException(error));
    }
  }
  /**
   * checking visitor
   */
  @Post('/checkin')
  @Middleware([validationMiddleware(CheckinDTO), authenticateMiddleware])
  public async createMessage(request: Request, response: Response, next: NextFunction, ) {
    try {
      const {
        userId,
        branchId,
        customerId,
        createdBy,
      }: CheckinDTO = request.body;
      //console.log('request.body;', request.body)
      let today = new Date().toISOString().slice(0, 10);
     // console.log(today);
      const createVisitorQuery = await getRepository(MycoidVisitor)
        .createQueryBuilder('mycoid_visitor')
        .insert()
        .into('mycoid_visitor')
        .values({
          ...{ userId: userId, branchId: branchId, customerId: customerId, checkinTime: (new Date()), status: Status.ACTIVIE, createdDatetime: new Date(), createdby: createdBy },
        })
        .execute();
      const brancAdedid = createVisitorQuery.identifiers[0].id;

      response.status(200).json({
        status: 200,
        timestamp: Date.now(),
        message: 'checkin successfully.',
        response: {
          id: createVisitorQuery.generatedMaps[0].visitorId,

        },
      });

    } catch (error) {
      next(new InternalServerErrorException(error));
    }
  }
  @Post('/checkout')
  @Middleware([validationMiddleware(CheckoutDTO), authenticateMiddleware])
  private async updateCustomer(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const {
        visitorId,
        userId,
        branchId,
        customerId,
      }: CheckoutDTO = request.body;
      //console.log(request.body);
      const updateQuery = await getRepository(MycoidVisitor)
        .createQueryBuilder('mycoid_visitor')
        .update()
        .set({ checkoutTime: ((new Date()).toLocaleTimeString()) })
        .where('mycoid_visitor.visitor_id=:id', { id: visitorId })
        .execute();
      response.status(200).json({
        status: 200,
        timestamp: Date.now(),
        message: 'checkout Successfully.',
        response: { updateQuery },
      });
    } catch (error) {
      //console.log(error);
      next(new InternalServerErrorException(error));
    }
  }


}
export default VisitorController