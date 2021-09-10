import * as bcrypt from 'bcryptjs';
//var md5 = require('md5');
import * as jwt from 'jsonwebtoken';
import { Router, Request, Response, NextFunction } from 'express';
import {
  UserWithThatEmailAlreadyExistsException,
  WrongCredentialsException,
  InternalServerErrorException,
  PasswordNotMatchException,
  UserMobileAlreadyExists,
  ContactAdminException,
  CommonException,
} from '../exceptions/index';
import { validationMiddleware, authenticateMiddleware } from '../middleware';
import { getRepository, Not } from 'typeorm';
import { MycoidCustomer } from '../entities';
import { CustomerLogInDTO, CustomerRegisterDTO, UpdateCustomerDTO, CustomerChangePasswordDTO } from '../dto';
//import { generatePasscode } from '../util';
//import { sendMail } from '../mail';
import { paginate, generatePasscode, imageUnlink } from '../util';
import { Status } from '../enum';
import { Controller, Get, Post, Middleware } from '../decorators'
import { sendMail } from '../mail';
@Controller('/customer')
export class CustomerController {
  // admin register
  @Post('/signup')
  @Middleware(validationMiddleware(CustomerRegisterDTO))
  public async register(request: Request, response: Response, next: NextFunction, ) {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        mobile,
        address,
        postcode,
        city,
        place,
        country,
      }: CustomerRegisterDTO = request.body;
      //console.log('request.body;',request.body)
      const checkingCustomerAlreadyExistQuery = await getRepository(MycoidCustomer)
        .createQueryBuilder('mycoid_customer')
        .where(
          'mycoid_customer.status IN (:...status) AND (mycoid_customer.email = :email  OR mycoid_customer.mobile = :mobile)',
          {
            status: [Status.ACTIVIE, Status.INACTIVE],
            email: email,
            mobile: mobile,
          },
        )
        .getOne();
      if (!checkingCustomerAlreadyExistQuery) {
        const createUserQuery = await getRepository(MycoidCustomer)
          .createQueryBuilder('mycoid_customercheckingCustomerAlreadyExistQuery')
          .insert()
          .into('mycoid_customer')
          .values({
            ...{ email: email, mobile: mobile, address: address, postcode: postcode, place: place, city: city, country: country, status: Status.ACTIVIE, createdDatetime: new Date(), firstName: firstName, lastName: lastName },
            password: await bcrypt.hash(password, 10),
            //password: await md5(password),
          })
          .execute();
        const creatToken = await bcrypt.hash(email, 10);
        //const creatToken = await md5(email);
        const token = await jwt.sign(
          {
            ...createUserQuery.generatedMaps[0],
          },
          process.env.JWT_SECRET,
          {
            expiresIn: 86400,
          },
        );
        // sendMail(
        //   '../template/resetPassword.hbs',
        //   email,
        //   'password creation from Swiss mycoid',
        //   {
        //     link: `${process.env.URL}reset_password/${creatToken}`,
        //     name: firstName,
        //     URL:process.env.URL
        //   },
        // );
        response.status(200).json({
          status: 200,
          timestamp: Date.now(),
          message: 'your account registered successfully.',
          response: {
            id: createUserQuery.generatedMaps[0].customerId,
            username: createUserQuery.generatedMaps[0].email,
            token: token,
          },
        });
      } else {

        if (
          checkingCustomerAlreadyExistQuery.email == email
        ) {
          next(new UserWithThatEmailAlreadyExistsException(email));
        }
        else {
          next(new UserMobileAlreadyExists(mobile));
          //next(new UserNameAlreadyExistsException(email));
        }
      }
    } catch (error) {
      next(new InternalServerErrorException(error));
    }
  }
  @Post('/login')
  @Middleware(validationMiddleware(CustomerLogInDTO))
  public async login(request: Request,
    response: Response,
    next: NextFunction, ) {
    try {
      const { password, emailOrMobile }: CustomerLogInDTO = request.body;
      const getCustomerQuery = await getRepository(MycoidCustomer)
        .createQueryBuilder('customer')
        .select([
          'customer.customerId',
          'customer.email',
          'customer.password',
          'customer.firstName',
          'customer.lastName',
          'customer.mobile',
          'customer.status'
        ])
        // .innerJoin('users.UserAccess', 'user_access')
        .where(
          '(customer.email = :email or customer.mobile=:mobile) AND customer.status In (:...status)',
          {
            email: emailOrMobile, mobile: emailOrMobile,
            status: [Status.ACTIVIE, Status.INACTIVE],

          },
        )
        .getOne();
      console.log('getCustomerQuery', getCustomerQuery)
      if (getCustomerQuery) {
        if (getCustomerQuery.status == Status.INACTIVE) {
          next(new ContactAdminException());
        }
        // else if (await md5(password)== getCustomerQuery.password) {
        else if (await bcrypt.compare(password, getCustomerQuery.password)) {
          delete getCustomerQuery.password;
          getCustomerQuery['userType'] = 'CUSTOMER';
          const token = await jwt.sign(
            { ...getCustomerQuery },
            process.env.JWT_SECRET,
            {
              expiresIn: 86400,
            },
          );

          response.status(200).json({
            status: 200,
            timestamp: Date.now(),
            message: 'customer logged in successfully',
            success: true,
            response: { ...getCustomerQuery, token: token },
          });
        } else {
          next(new PasswordNotMatchException());
        }
      } else {
        next(new WrongCredentialsException());
      }
    } catch (error) {
      console.log(error);
      next(new InternalServerErrorException(error));
    }
  }
  // All Customer details
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
    const productCountQuery = await MycoidCustomer.count();
    if (productCountQuery) {
      const paginationData = paginate(
        productCountQuery,
        parseInt(currentPage),
        parseInt(pageSize),
        parseInt(maxPages),
      );

      let PaginationQuery;
      PaginationQuery = await getRepository(MycoidCustomer)
        .createQueryBuilder('mycoid_customer')
        .where(`mycoid_customer.status In (:...status)`, { status: [Status.ACTIVIE, Status.INACTIVE] })
        .skip(paginationData.startIndex)
        .take(paginationData.pageSize)
        .orderBy('customer_id', 'DESC')
        .getMany();
      let result = [];
      PaginationQuery.map(function (customer, index) {

        result.push(customer);
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

  // customer remove
  @Post('/remove/:id')
  @Middleware([authenticateMiddleware])
  private async removeCustomer(request: Request, response: Response, next: NextFunction, ) {
    let Id = parseInt(request.params.id);
    try {
      const removeQuery = await getRepository(MycoidCustomer)
        .delete({ customerId: Id });
      response.status(200).json({
        status: 200,
        timestamp: Date.now(),
        message: 'Customer remove Successfully.',
        response: { removeQuery },
      });
    } catch (error) {
      //console.log(error);
      next(new InternalServerErrorException(error));
    }
  }

  // customer password update
  @Post('/changePassword/:id')
  @Middleware([validationMiddleware(CustomerChangePasswordDTO), authenticateMiddleware])
  private async changePassword(request: Request, response: Response, next: NextFunction, ) {
    const { oldPassword, password }: CustomerChangePasswordDTO = request.body;
    let Id = parseInt(request.params.id);
    if (!Id || Id == NaN)
      return next(new CommonException('404', 'No Record Found'));
    try {
      let getUserQuery = await getRepository(MycoidCustomer)
        .createQueryBuilder('users')
        .select([
          'users.customerId',
          'users.email',
          'users.password',
          'users.firstName',
          'users.lastName',
          'users.mobile',
          'users.status'
        ])
        // .innerJoin('users.UserAccess', 'user_access')
        .where(
          'users.customerId = :customerId  AND users.status In (:...status)',
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
          const updateUserQuery = await getRepository(MycoidCustomer)
            .createQueryBuilder('users')
            .update()
            .set({
              password: await bcrypt.hash(password, 10)
              //password: await md5(password)
            })
            .where('customer_id = :id', {
              id: getUserQuery.customerId
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
  @Post('/update/:id')
  @Middleware([validationMiddleware(UpdateCustomerDTO), authenticateMiddleware])
  private async updateCustomer(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {

    try {
      let Id = parseInt(request.params.id);
      const {
        firstName,
        lastName,
        email,
        mobile,
        address,
        postcode,
        city,
        place,
        country,
        modifiedBy,
      }: UpdateCustomerDTO = request.body;
      console.log(request.body);

      const getCustomerQuery = await getRepository(MycoidCustomer)
      .createQueryBuilder('mycoid_customer')
      .leftJoinAndSelect('mycoid_customer.mycoidCustomerFamilys', 'mycoidCustomerFamilys')
      .where(
        'mycoid_customer.customer_id = :id  AND mycoid_customer.status In (:...status)',
        {
          id: Id,
          status: [Status.ACTIVIE, Status.INACTIVE],

        },
      )
      .getOne();

      let imageData = "";
      let imageNewLink = "";
      let oldImage = "";
      oldImage = getCustomerQuery.image;
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
         else if(imageNewLink != "" && oldImage!="")
         {
           let imagRemove = imageUnlink(oldImage);
         }


      const updateQuery = await getRepository(MycoidCustomer)
        .createQueryBuilder('mycoid_customer')
        .update()
        .set({  image: imageNewLink,email: email, mobile: mobile, address: address, lastName: lastName, postcode: postcode, place: place, city: city, country: country, status: 1, modifiedDatetime: new Date(), firstName: firstName, modifiedby: modifiedBy })
        .where('mycoid_customer.customer_id=:id', { id: Id })
        .execute();
      response.status(200).json({
        status: 200,
        timestamp: Date.now(),
        message: 'customer Update Successfully.',
        response: { updateQuery },
      });
    } catch (error) {
      //console.log(error);
      next(new InternalServerErrorException(error));
    }
  }

  //  @Post('/reset/password')
  //   @Middleware(validationMiddleware(SendResetPasswordLinkDTO))
  //   public async sentResetPasswordLink(
  //     request: Request,
  //     response: Response,
  //     next: NextFunction,
  //   ){
  //     try {
  //       const { email }: SendResetPasswordLinkDTO = request.body;
  //       console.log(request.body);
  //       const getUserQuery = await getRepository(MycoidUsers)
  //         .createQueryBuilder('users')
  //         .select(['users.userId', 'users.email', 'users.firstName'])
  //         .where(
  //           'users.email = :email  AND users.status In (:...status)',
  //           {
  //             email: email,
  //             status: [Status.ACTIVIE, Status.INACTIVE],           
  //           },
  //         )
  //         .getOne();
  //         console.log('aaaaaa');
  //         console.log(getUserQuery);
  //         console.log('wwwww');
  //       if (getUserQuery) {
  //         const token = await jwt.sign(
  //           { id: getUserQuery.userId },
  //           process.env.JWT_SECRET,
  //           {
  //             expiresIn: 86400,
  //           },
  //         );
  //         const updateUserQuery = await getRepository(MycoidUsers)
  //           .createQueryBuilder('mycoid_users')
  //           .update()
  //           .set({
  //             forgotToken: token,
  //           })
  //           .where('mycoid_users.user_id = :id', {
  //             id: getUserQuery.userId            
  //           })
  //           .execute();
  //         if (updateUserQuery.raw.affectedRows) {
  //           sendMail(
  //             '../template/resetPassword.hbs',
  //             getUserQuery.email,
  //             'Reset password from mycoid',
  //             {
  //               link: `${process.env.URL}reset_password/${token}`,
  //               name: getUserQuery,
  //               URL:process.env.URL
  //             },
  //           );
  //           response.status(200).json({
  //             status: 200,
  //             timestamp: Date.now(),
  //             message: 'Reset password link send to email successfully',
  //             response: {},
  //           });
  //         } else {
  //           next(new CommonException('404', 'No User Found'));
  //         }
  //       } else {
  //         next(new CommonException('404', 'No User Found1'));
  //       }
  //     } catch (error) {
  //       next(new InternalServerErrorException(error));
  //     }
  //   }
  // // reset password
  //   @Post('/reset/passwordlinkviatoken')
  //   public async passwordlinkviatoken   (
  //     request: Request,
  //     response: Response,
  //     next: NextFunction,
  //   ) {
  //     try {
  //       const { token,password } = request.body;
  //       console.log(request.body);
  //       const passwordHashed = await bcrypt.hash(password, 10);
  //       console.log(passwordHashed)
  //       if(token){
  //         const updateUserQuery = await getRepository(MycoidUsers)
  //           .createQueryBuilder('mycoid_users')
  //           .update()
  //           .set({
  //             password: passwordHashed,
  //             forgotToken: '0',

  //           })
  //           .where('mycoid_users.forgot_token = :resetPasswordToken', {
  //             resetPasswordToken: token

  //           })
  //           .execute();
  //         if (updateUserQuery.raw.affectedRows) {
  //           response.status(200).json({
  //             status: 200,
  //             timestamp: Date.now(),
  //             message: 'Password Updated Successfully',
  //             response: {},
  //           })

  //         } else {
  //           next(new CommonException('404', 'Invalid Token'));
  //         }
  //       } else {
  //         next(new InternalServerErrorException('Token is not found'));
  //       }
  //     }
  //     catch(error) {
  //       console.log(error)
  //       next(new InternalServerErrorException(error));
  //     }
  //   }



  @Get('/:id')
  @Middleware([authenticateMiddleware])
  public async getItem(request: Request,
    response: Response,
    next: NextFunction) {
    let Id = parseInt(request.params.id);
    let data;
    const getCustomerQuery = await getRepository(MycoidCustomer)
      .createQueryBuilder('mycoid_customer')
      .leftJoinAndSelect('mycoid_customer.mycoidCustomerFamilys', 'mycoidCustomerFamilys')
      .where(
        'mycoid_customer.customer_id = :id  AND mycoid_customer.status In (:...status)',
        {
          id: Id,
          status: [Status.ACTIVIE, Status.INACTIVE],

        },
      )
      .getOne();
    if (getCustomerQuery) {
      delete getCustomerQuery.forgotToken;
      delete getCustomerQuery.password;
      delete getCustomerQuery.verificationToken;
      response.status(200).json({
        status: 200,
        timestamp: Date.now(),
        message: 'customer data',
        success: true,
        response: { ...getCustomerQuery },
      });
    } else {
      next(new CommonException('404', 'No Record Found'));
    }
  }


}
export default CustomerController