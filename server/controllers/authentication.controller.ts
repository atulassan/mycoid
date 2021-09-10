import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
//var md5 = require('md5');
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
import { validationMiddleware } from '../middleware';
import { getRepository, Not, Entity } from 'typeorm';
import { MycoidUsers, MycoidBranchusers, MycoidCustomer } from '../entities';
import { LogInDTO, UserRegisterDTO, VerifyTokenDTO, SuperUserRegisterDTO, SendResetPasswordLinkDTO, CreatePasswordDTO } from '../dto';
//import { generatePasscode } from '../util';
import { Status } from '../enum';
import { Controller, Get, Post, Middleware } from '../decorators'
import { sendMail } from '../mail';
import { uuidv4 } from '../util';
@Controller('/auth')
export class AuthenticationController {
  // admin register
  @Post('/signup')
  @Middleware(validationMiddleware(UserRegisterDTO))
  public async register(request: Request, response: Response, next: NextFunction, ) {
    try {
      const {
        companyTypeId,
        companyName,
        firstName,
        lastName,
        telephone,
        email,
        contactperson,
        website,
        extraInfo,
        mobile,
        address,
        postcode,
        city,
        place,
        country,
      }: UserRegisterDTO = request.body;
      //console.log('request.body;',request.body)
      const checkingUserAlreadyExistQuery = await getRepository(MycoidUsers)
        .createQueryBuilder('mycoid_users')
        .where(
          'mycoid_users.status IN (:...status) AND (mycoid_users.email = :email  OR mycoid_users.mobile = :mobile)',
          {
            status: [Status.ACTIVIE, Status.INACTIVE],
            email: email,
            mobile: mobile,

          },
        )
        .getOne();
      if (!checkingUserAlreadyExistQuery) {
        const creatToken = await uuidv4();

        const createUserQuery = await getRepository(MycoidUsers)
          .createQueryBuilder('mycoid_users')
          .insert()
          .into('mycoid_users')
          .values({
            ...{ companyName: companyName, telephone: telephone, contactperson: contactperson, email: email, website: website, extraInfo: extraInfo, mobile: mobile, address: address, postcode: postcode, place: place, city: city, country: country, userRole: 2, status: Status.ACTIVIE, createdDatetime: new Date(), companyType: companyTypeId, firstName: firstName, lastName: lastName },
            verificationToken: creatToken//await bcrypt.hash(email, 10),
            //verificationToken: await md5(email),

          })
          .execute();

        // const creatToken = await md5(email);
        const token = await jwt.sign(
          {
            ...createUserQuery.generatedMaps[0],
          },
          process.env.JWT_SECRET,
          {
            expiresIn: 86400,
          },
        );
        sendMail(
          '../template/register.hbs',
          email,
          'password creation from Swiss mycoid',
          {
            link: `${process.env.URL}verify-token/${creatToken}`,
            name: firstName,
            URL: process.env.URL
          },
        );
        response.status(200).json({
          status: 200,
          timestamp: Date.now(),
          message: 'your account registered successfully.',
          response: {
            //id: createUserQuery.generatedMaps[0].userId,
            //username: createUserQuery.generatedMaps[0].email,
            //token: token,
          },
        });
      } else {

        if (
          checkingUserAlreadyExistQuery.email == email
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

  @Post('/check-token')
  @Middleware(validationMiddleware(VerifyTokenDTO))
  public async checkVerifyToken(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const { verifyToken }: VerifyTokenDTO = request.body;
      const user = getRepository(MycoidUsers);

      const data = await user.findOne({ verificationToken: verifyToken });
      //  console.log(data);
      if (data) {
        response.status(200).json({
          status: 200,
          timestamp: Date.now(),
          message: 'token is exists',
          success: true,
          response: { companyName: data.companyName, verificationToken: verifyToken },
        });
      }
      else {
        next(new CommonException('404', 'No Client Found'));
      }
    } catch (error) {
      next(new InternalServerErrorException(error));
    }
  }
  // superadmin creation
  @Post('/superadminsignup')
  @Middleware(validationMiddleware(SuperUserRegisterDTO))
  public async adminregister(request: Request, response: Response, next: NextFunction, ) {
    try {
      const {
        companyTypeId,
        firstName,
        lastName,
        telephone,
        email,
        contactperson,
        website,
        extraInfo,
        mobile,
        address,
        postcode,
        city,
        place,
        country,
        password,

      }: SuperUserRegisterDTO = request.body;
      console.log('request.body;', request.body)
      const checkingUserAlreadyExistQuery = await getRepository(MycoidUsers)
        .createQueryBuilder('mycoid_users')
        .where(
          'mycoid_users.status IN (:...status) AND (mycoid_users.email = :email  OR mycoid_users.mobile = :mobile)',
          {
            status: [Status.ACTIVIE, Status.INACTIVE],
            email: email,
            mobile: mobile,
          },
        )
        .getOne();
      if (!checkingUserAlreadyExistQuery) {
        const createUserQuery = await getRepository(MycoidUsers)
          .createQueryBuilder('mycoid_users')
          .insert()
          .into('mycoid_users')
          .values({
            ...{ telephone: telephone, contactperson: contactperson, email: email, website: website, extraInfo: extraInfo, mobile: mobile, address: address, postcode: postcode, place: place, city: city, country: country, userRole: 1, status: Status.ACTIVIE, createdDatetime: new Date(), companyType: companyTypeId, firstName: firstName, lastName: lastName },
            password: await bcrypt.hash(password, 10),
            //password: await md5(password),

          })
          .execute();
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
        //   '../../app/template/passcode.template.hbs',
        //   email,
        //   'welcome from change of flight',
        //   { passcode: password },
        // );
        response.status(200).json({
          status: 200,
          timestamp: Date.now(),
          message: 'your account registered successfully.',
          response: {
            id: createUserQuery.generatedMaps[0].useId,
            username: createUserQuery.generatedMaps[0].email,
            token: token,
          },
        });
      } else {

        if (
          checkingUserAlreadyExistQuery.email == email
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
  @Middleware(validationMiddleware(LogInDTO))
  public async login(request: Request,
    response: Response,
    next: NextFunction, ) {
    try {
      const { email, password, userType }: LogInDTO = request.body;
      var getUserQuery;
      if (userType == 'CUSTOMER') {
         getUserQuery = await getRepository(MycoidCustomer)
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
            'users.email = :email  AND users.status In (:...status)',
            {
              email: email,
              status: [Status.ACTIVIE, Status.INACTIVE],

            },
          )
          .getOne();
      }
      else if (userType == 'BRANCHUSER') {
         getUserQuery = await getRepository(MycoidBranchusers)
          .createQueryBuilder('bu')
          .select([
            'bu.branchuserId',
            'bu.email',
            'bu.password',
            'bu.firstName',
            'bu.branchId',
            'bu.lastName',
            'bu.mobile',
            'bu.status'
          ])
          // .innerJoin('users.UserAccess', 'user_access')
          .where(
            'bu.email = :email  AND bu.status In (:...status)',
            {
              email: email,
              status: [Status.ACTIVIE, Status.INACTIVE],

            },
          )
          .getOne();
      }
      else {
         getUserQuery = await getRepository(MycoidUsers)
          .createQueryBuilder('users')
          .select([
            'users.userId',
            'users.email',
            'users.password',
            'users.firstName',
            'users.lastName',
            'users.mobile',
            'users.userRole',
            'users.status'
          ])
          // .innerJoin('users.UserAccess', 'user_access')
          .where(
            'users.email = :email  AND users.status In (:...status)',
            {
              email: email,
              status: [Status.ACTIVIE, Status.INACTIVE],

            },
          )
          .getOne();
      }
      console.log(request.body);



      if (getUserQuery) {
        if (getUserQuery.status == Status.INACTIVE) {
          next(new ContactAdminException());
        }
        //else if (await md5(password)== getUserQuery.password) {
        else if (await bcrypt.compare(password, getUserQuery.password)) {
          delete getUserQuery.password;
          getUserQuery['userType'] = userType ? userType : 'USER';
          const token = await jwt.sign(
            { ...getUserQuery },
            process.env.JWT_SECRET,
            {
              expiresIn: 86400,
            },
          );

         
          console.log('getUserQuery', getUserQuery)
          response.status(200).json({
            status: 200,
            timestamp: Date.now(),
            message: 'user logged in successfully',
            success: true,
            response: { ...getUserQuery, token: token },
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
  // createpassword of admin
  @Post('/create/password')
  @Middleware(validationMiddleware(CreatePasswordDTO))
  public async createadminPassword(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const {
        password,
        verifyToken
      }: CreatePasswordDTO = request.body;
      console.log(request.body);
      const getUserQuery = await getRepository(MycoidUsers)
        .createQueryBuilder('users')
        .select(['users.userId', 'users.email', 'users.firstName'])
        .where(
          'users.status IN (:...status) AND (users.verification_token = :verifyToken)',
          {
            verifyToken: verifyToken,
            status: [Status.ACTIVIE, Status.INACTIVE],
          },
        )
        .getOne();
      //console.log('aaaaaa');
      console.log(getUserQuery);
      //console.log('wwwww');
      if (getUserQuery) {
        const updateUserQuery = await getRepository(MycoidUsers)
          .createQueryBuilder('mycoid_users')
          .update()
          .set({
            password: await bcrypt.hash(password, 10)
            //password: await md5(password)
          })
          .where('mycoid_users.user_id = :id', {
            id: getUserQuery.userId
          })
          .execute();
        if (updateUserQuery.raw.affectedRows) {
          response.status(200).json({
            status: 200,
            timestamp: Date.now(),
            message: 'Password  created successfully',
            response: {getUserQuery},
          });
        } else {
          next(new CommonException('404', 'No User Found'));
        }
      } else {
        next(new CommonException('404', 'No User Found'));
      }
    } catch (error) {
      next(new InternalServerErrorException(error));
    }
  }


  @Post('/reset/password')
  @Middleware(validationMiddleware(SendResetPasswordLinkDTO))
  public async sentResetPasswordLink(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const { email }: SendResetPasswordLinkDTO = request.body;
      console.log(request.body);
      const getUserQuery = await getRepository(MycoidUsers)
        .createQueryBuilder('users')
        .select(['users.userId', 'users.email', 'users.firstName'])
        .where(
          'users.email = :email  AND users.status In (:...status)',
          {
            email: email,
            status: [Status.ACTIVIE, Status.INACTIVE],
          },
        )
        .getOne();
      console.log('aaaaaa');
      console.log(getUserQuery);
      console.log('wwwww');
      if (getUserQuery) {
        const token = await jwt.sign(
          { id: getUserQuery.userId },
          process.env.JWT_SECRET,
          {
            expiresIn: 86400,
          },
        );
        const updateUserQuery = await getRepository(MycoidUsers)
          .createQueryBuilder('mycoid_users')
          .update()
          .set({
            forgotToken: token,
          })
          .where('mycoid_users.user_id = :id', {
            id: getUserQuery.userId
          })
          .execute();
        if (updateUserQuery.raw.affectedRows) {
          sendMail(
            '../template/resetPassword.hbs',
            getUserQuery.email,
            'Reset password from mycoid',
            {
              link: `${process.env.URL}reset_password/${token}`,
              name: getUserQuery,
              URL: process.env.URL
            },
          );
          response.status(200).json({
            status: 200,
            timestamp: Date.now(),
            message: 'Reset password link send to email successfully',
            response: {},
          });
        } else {
          next(new CommonException('404', 'No User Found'));
        }
      } else {
        next(new CommonException('404', 'No User Found1'));
      }
    } catch (error) {
      next(new InternalServerErrorException(error));
    }
  }
  // reset password
  @Post('/reset/passwordlinkviatoken')
  public async passwordlinkviatoken(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const { token, password } = request.body;
      console.log(request.body);
      const passwordHashed = await bcrypt.hash(password, 10);
      //const passwordHashed = await md5(password);
      console.log(passwordHashed)
      if (token) {

        const getUserQuery = await getRepository(MycoidUsers)
        .createQueryBuilder('users')
        .select(['users.userId', 'users.email', 'users.firstName'])
        .where(
          'users.status IN (:...status) AND (users.forgot_token = :resetPasswordToken)',
          {
            resetPasswordToken: token,
            status: [Status.ACTIVIE, Status.INACTIVE],
          },
        )
        .getOne();


        const updateUserQuery = await getRepository(MycoidUsers)
          .createQueryBuilder('mycoid_users')
          .update()
          .set({
            password: passwordHashed,
            forgotToken: '0',

          })
          .where('mycoid_users.forgot_token = :resetPasswordToken', {
            resetPasswordToken: token

          })
          .execute();
        if (updateUserQuery.raw.affectedRows) {
          response.status(200).json({
            status: 200,
            timestamp: Date.now(),
            message: 'Password Updated Successfully',
            response: {getUserQuery},
          })

        } else {
          next(new CommonException('404', 'Invalid Token'));
        }
      } else {
        next(new InternalServerErrorException('Token is not found'));
      }
    }
    catch (error) {
      console.log(error)
      next(new InternalServerErrorException(error));
    }
  }





}
export default AuthenticationController