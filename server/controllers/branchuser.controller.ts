import { Request, Response, NextFunction } from 'express'
import { Controller, Get, Post, Middleware } from '../decorators'
import { validationMiddleware, authenticateMiddleware } from '../middleware'
import {
  UserWithThatEmailAlreadyExistsException,
  InternalServerErrorException,
  UserMobileAlreadyExists,
  CommonException,
  PasswordNotMatchException,
  WrongCredentialsException,
  ContactAdminException,

} from '../exceptions/index';
import { CreateBranchUserDTO, UpdateBranchUserDTO,UserChangePasswordDTO } from '../dto'
import { getRepository, getConnection } from 'typeorm';
import { MycoidBranchusers } from '../entities';
import { Status } from '../enum';
import * as bcrypt from 'bcryptjs';
//var md5 = require('md5');
import { paginate, generatePasscode, imageUnlink } from '../util';
import { Utils } from 'handlebars';
import { UserType } from '../enum/userType.enum';

@Controller('/branchuser')
export class BranchuserController {
  //All branch User details
  @Get('/all')
  @Middleware([authenticateMiddleware])
  
  public async index(request: Request, response: Response, next: NextFunction) {
    //var { currentPage, maxPages, pageSize } = request.query;
    var currentPage, maxPages, pageSize ;
    currentPage = request.query.currentpage;
    maxPages = request.query.maxPages;
    pageSize = request.query.pageSize;
    currentPage = currentPage ? currentPage : 1;
    maxPages = maxPages ? maxPages : 1;
    pageSize = pageSize && pageSize <= 100 ? pageSize : 10;
    let userId=0;
    if(request['user']['userType']!=UserType.CUSTOMER){
      
      userId=request['user']['userId']
    }
    const productCountQuery = await MycoidBranchusers
    .createQueryBuilder('mycoid_branchusers')
    .where(`mycoid_branchusers.status In (:...status) and  (mycoid_branchusers.userId=:userId or mycoid_branchusers.branchuserId=:userId )`, { status: [Status.ACTIVIE, Status.INACTIVE],userId })
    .getCount();
    if (productCountQuery) {
      const paginationData = paginate(
        productCountQuery,
        parseInt(currentPage),
        parseInt(pageSize),
        parseInt(maxPages),
      );

      let PaginationQuery;
       PaginationQuery = await getRepository(MycoidBranchusers)
        .createQueryBuilder('mycoid_branchusers')
        .leftJoinAndSelect('mycoid_branchusers.mycoidBranch', 'mycoidBranch')
       .where(`mycoid_branchusers.status In (:...status) and  (mycoid_branchusers.userId=:userId or mycoid_branchusers.branchuserId=:userId )`, { status: [Status.ACTIVIE, Status.INACTIVE],userId })
        .skip(paginationData.startIndex)
        .take(paginationData.pageSize)
        .orderBy('mycoid_branchusers.branchuserId', 'DESC')
        .getMany();
     let result = [];
    PaginationQuery.map(function (branchuser, index) {      
        result.push(this.loadBranchUser(branchuser));
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
  loadBranchUser(branchuser){
    if (branchuser) {
      delete branchuser.password;
      delete branchuser.createdby;
    //  delete branchuser.status;
      delete branchuser.modifiedby;
      delete branchuser.createdby;
      delete branchuser.mycoidBranch.createdby;
      delete branchuser.mycoidBranch.createdDatetime;
      delete branchuser.mycoidBranch.modifiedby;
      delete branchuser.mycoidBranch.createdby;
      delete branchuser.mycoidBranch.modifiedDatetime;
    }
    return branchuser;
  }

  // customer password update
  @Post('/changePassword/:id')
  @Middleware([validationMiddleware(UserChangePasswordDTO), authenticateMiddleware])
  private async changePassword(request: Request, response: Response, next: NextFunction, ) {
    const { oldPassword, password }: UserChangePasswordDTO = request.body;
    let Id = parseInt(request.params.id);
    if (!Id || Id == NaN)
      return next(new CommonException('404', 'No Record Found'));
    try {
      let getUserQuery = await getRepository(MycoidBranchusers)
        .createQueryBuilder('users')
        .select([
          'users.branchuserId',
          'users.email',
          'users.password',
          'users.firstName',
          'users.lastName',
          'users.mobile',
          'users.status'
        ])
        // .innerJoin('users.UserAccess', 'user_access')
        .where(
          'users.branchuserId = :customerId  AND users.status In (:...status)',
          {
            customerId: Id,
            status: [Status.ACTIVIE, Status.INACTIVE],

          },
        )
        .getOne();
      if (getUserQuery) {
        if (getUserQuery.status == Status.INACTIVE) {
          next(new ContactAdminException());
        }
        else if (await bcrypt.compare(oldPassword, getUserQuery.password)) {
          const updateUserQuery = await getRepository(MycoidBranchusers)
            .createQueryBuilder('users')
            .update()
            .set({
              password: await bcrypt.hash(password, 10)
              //password: await md5(password)
            })
            .where('branchuserId = :id', {
              id: getUserQuery.branchuserId
            })
            .execute();
        }
        else {
          next(new PasswordNotMatchException());
        }
      }
      else {
        next(new WrongCredentialsException());
      }
      response.status(200).json({
        status: 200,
        timestamp: Date.now(),
        message: 'Password updated successfully.',
        response: { getUserQuery },
      });
    } catch (error) {
      //console.log(error);
      next(new InternalServerErrorException(error));
    }
  }

  
    // get branch based data
    @Get('/branch/:id')
    @Middleware([authenticateMiddleware])
    public async getBranchUser(request: Request, response: Response, next: NextFunction) {
      let Id = parseInt(request.params.id);
     // var { currentPage, maxPages, pageSize } = request.query;
      var currentPage, maxPages, pageSize ;
      currentPage = request.query.currentpage;
      maxPages = request.query.maxPages;
      pageSize = request.query.pageSize;
      currentPage = currentPage ? currentPage : 1;
      maxPages = maxPages ? maxPages : 1;
      pageSize = pageSize && pageSize <= 100 ? pageSize : 10;
      const productCountQuery = await getRepository(MycoidBranchusers)
      .createQueryBuilder('mycoid_branchusers')
      .leftJoinAndSelect('mycoid_branchusers.mycoidBranch', 'mycoidBranch')
      .where('mycoid_branchusers.branchId = :id',{id: Id,},)
      .getCount();
      if (productCountQuery) {
        const paginationData = paginate(
          productCountQuery,
          parseInt(currentPage),
          parseInt(pageSize),
          parseInt(maxPages),
        );
        
        let PaginationQuery;
         PaginationQuery = await getRepository(MycoidBranchusers)
          .createQueryBuilder('mycoid_branchusers')
         .where(`mycoid_branchusers.branch_id =:id`, { id: Id })
          .skip(paginationData.startIndex)
          .take(paginationData.pageSize)
          .orderBy('branchuser_id', 'DESC')
          .getMany();
       let result = [];
      PaginationQuery.map(function (branchuser, index) {
        
        result.push(this.loadBranchUser(branchuser));
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
  // Branch User remove
  @Post('/remove/:id')
  @Middleware([authenticateMiddleware])
  private async removeBranchUser(request: Request,response: Response,next: NextFunction,) {
      let Id = parseInt(request.params.id);
      try {
      const updateQuery = await getRepository(MycoidBranchusers)
          .delete({ branchuserId: Id });
          response.status(200).json({
              status: 200,
              timestamp: Date.now(),
              message: 'Branch User remove Successfully.',
              response: { updateQuery },
          });
      } catch (error) {
      //console.log(error);
      next(new InternalServerErrorException(error));
      }
  }
  // Addd Branch User
  @Post('/add')
   @Middleware([validationMiddleware(CreateBranchUserDTO), authenticateMiddleware])
  public async register(request: Request, response: Response, next: NextFunction,) {
    try {
      const {
        branchId,
        branchUserRole,
        userId,
        firstName,
        lastName,
        telephone,
        email,
        userPosition,
        website,
        password,
        mobile,
        address,
        postcode,
        city,
        place,
        country,
        createdBy,
        
     //   role,
      }: CreateBranchUserDTO = request.body;
      console.log(request.body)
      const checkingBranchUserAlreadyExistQuery = await getRepository(MycoidBranchusers) 
        .createQueryBuilder('mycoid_branchusers')
        .where(
          'mycoid_branchusers.status IN (:...status) AND (mycoid_branchusers.email = :email  OR mycoid_branchusers.mobile = :mobile)',
          {status: [Status.ACTIVIE, Status.INACTIVE],email: email,mobile: mobile},)
        .getOne();
        if (!checkingBranchUserAlreadyExistQuery) {
        const createUserQuery = await getRepository(MycoidBranchusers)
          .createQueryBuilder('mycoid_branchusers')
          .insert()
          .into('mycoid_branchusers')
          .values({
          ...{ branchId: branchId, userId: userId, telephone: telephone, userPosition: userPosition, email: email, website: website, mobile: mobile, address: address, postcode: postcode, place: place, city: city, country: country, branchUserRole:branchUserRole, status:Status.ACTIVIE, createdDatetime: new Date(), firstName: firstName, lastName: lastName,createdby : createdBy},
          password:await bcrypt.hash(password, 10), //await md5(email),
        })
          .execute();
          response.status(200).json({
          status: 200,
          timestamp: Date.now(),
          message: 'Branch user added successfully.',
          response: {
            id: createUserQuery.generatedMaps[0].branchuser_id,
            username: createUserQuery.generatedMaps[0].email,
            
          },
        });
        } else {
        
          if (checkingBranchUserAlreadyExistQuery.email == email) {
            next(new UserWithThatEmailAlreadyExistsException(email));
          }
          else {
            next(new UserMobileAlreadyExists(mobile));
            
          }
        }
    } catch (error) {
      next(new InternalServerErrorException(error));
    }
  } 
  // Branch User Update
 @Post('/update/:id')
  @Middleware([validationMiddleware(UpdateBranchUserDTO), authenticateMiddleware])
  private async updateBranchUser(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      let Id = parseInt(request.params.id);
      const {
        id,
        branchId,
        branchUserRole,
        userId,
        firstName,
        lastName,
        telephone,
        email,
        userPosition,
        website,
        password,
        mobile,
        address,
        postcode,
        city,
        place,
        country,
        modifiedBy,
        userStatus
      }: UpdateBranchUserDTO = request.body;
    
      const getBranchQuery = await getRepository(MycoidBranchusers)
      .createQueryBuilder('mycoid_branchusers')
      .leftJoinAndSelect('mycoid_branchusers.mycoidBranch', 'mycoidBranch')
      .where(
        'mycoid_branchusers.branchuser_id = :id  AND mycoid_branchusers.status In (:...status)',
        {
          id: Id,
          status: [Status.ACTIVIE, Status.INACTIVE],
         
        },
      )
      .getOne();
      let imageData = "";
      let imageNewLink = "";
      let oldImage = "";
      oldImage = getBranchQuery.image;
      if(request.body.uploadedData){
        imageData = request.body.uploadedData['upload'];
        imageNewLink = request.body.uploadedData['saveImage'];
      }
 console.log("-----------------ttttttt-------------");
        if(imageData != "1" && oldImage=="")
         {
           imageNewLink = "";
         }
         else if(imageData != "1" && oldImage!="")
         {
                imageNewLink = oldImage;
         }
         else if(imageData == "1" && oldImage!="")
         {
           let imagRemove = imageUnlink(oldImage);
         }

      const updateQuery = await getRepository(MycoidBranchusers)
            .createQueryBuilder('mycoid_branchusers')
            .update()
            .set({ image: imageNewLink,branchId: branchId, telephone: telephone, userPosition: userPosition, email: email, website: website, mobile: mobile, address: address, postcode: postcode, place: place, city: city, country: country, branchUserRole:branchUserRole, modifiedDatetime: new Date(), firstName: firstName, lastName: lastName, modifiedby : modifiedBy, status:userStatus, 
              password: await bcrypt.hash(email, 10)//await md5(email)
            })
            .where('mycoid_branchusers.branchuser_id=:id',{ id: Id},)
            .execute();
            response.status(200).json({
                status: 200,
                timestamp: Date.now(),
                message: 'Branch user Update Successfully.',
                response: { updateQuery },
            }); 
      } catch (error) {
      //console.log(error);
      next(new InternalServerErrorException(error));
    }
  }

  @Get('/:id')
  @Middleware([authenticateMiddleware])
    public async getItem(request: Request,
    response: Response,
    next: NextFunction) {
    let Id = parseInt(request.params.id);
    let data;
    const getBranchQuery = await getRepository(MycoidBranchusers)
          .createQueryBuilder('mycoid_branchusers')
          .leftJoinAndSelect('mycoid_branchusers.mycoidBranch', 'mycoidBranch')
          .where(
            'mycoid_branchusers.branchuser_id = :id  AND mycoid_branchusers.status In (:...status)',
            {
              id: Id,
              status: [Status.ACTIVIE, Status.INACTIVE],
             
            },
          )
          .getOne();
        if(getBranchQuery)
        {
            response.status(200).json({
                status: 200,
                timestamp: Date.now(),
                message: 'branch User data',
                success:true,
                response: { ...this.loadBranchUser(getBranchQuery) },
              });
        } else {
          next(new CommonException('404', 'No Record Found'));
        }
    }
}
export default BranchuserController