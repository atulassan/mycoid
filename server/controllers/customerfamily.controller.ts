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
import { MycoidCustomerFamily } from '../entities';
import { CustomerLogInDTO,  CustomerFamilyRegisterDTO, UpdateCustomerFamilyDTO} from '../dto';
//import { generatePasscode } from '../util';
//import { sendMail } from '../mail';
import { Status } from '../enum';
import { Controller, Get, Post, Middleware } from '../decorators'
import { sendMail } from '../mail';
import { imageUnlink } from '../util';
@Controller('/custguest')
export class CustomerfamilyController { 
  // admin register
  @Post('/add')
   @Middleware([validationMiddleware(CustomerFamilyRegisterDTO), authenticateMiddleware])
  public async register(request: Request, response: Response, next: NextFunction,) {
    try {
      const {
        firstName,
        lastName,
        relation,
        customerId
     }: CustomerFamilyRegisterDTO = request.body;
      //console.log('request.body;',request.body)

      let imageData = "";
      let imageNewLink = "";

      if(request.body.uploadedData){
        imageData = request.body.uploadedData['upload'];
        imageNewLink = request.body.uploadedData['saveImage'];
      }


      const createUserQuery = await getRepository(MycoidCustomerFamily)
          .createQueryBuilder('mycoid_customer_family')
          .insert()
          .into('mycoid_customer_family')
          .values({
          ...{image: imageNewLink, customerId: customerId, relation: relation, status:Status.ACTIVIE, createdDatetime: new Date(), firstName: firstName, lastName: lastName, createdby: customerId},
        })
          .execute();
        response.status(200).json({
          status: 200,
          timestamp: Date.now(),
          message: 'customer guest added successfully.',
          response: {
            id: createUserQuery.generatedMaps[0].customerId,
            username: createUserQuery.generatedMaps[0].email,
            
          },
        });
      
    } catch (error) {
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
     const getCustomerQuery = await getRepository(MycoidCustomerFamily)
           .createQueryBuilder('mycoid_customer')
           .where(
             'mycoid_customer_family.cust_family_id = :id  AND mycoid_customer_family.status In (:...status)',
             {
               id: Id,
               status: [Status.ACTIVIE, Status.INACTIVE],
              
             },
           )
           .getOne();
         if(getCustomerQuery)
         {
             response.status(200).json({
                 status: 200,
                 timestamp: Date.now(),
                 message: 'customer family data',
                 success:true,
                 response: { ...getCustomerQuery },
               });
         } else {
           next(new CommonException('404', 'No Record Found'));
         }
     }
   // customer remove
   @Post('/remove/:id')
   @Middleware([authenticateMiddleware])
   private async removeCustomer(request: Request,response: Response,next: NextFunction,) {
       let Id = parseInt(request.params.id);
       try {
       const removeQuery = await getRepository(MycoidCustomerFamily)
          .delete({ custFamilyId: Id });
          response.status(200).json({
               status: 200,
               timestamp: Date.now(),
               message: 'Customer guest remove Successfully.',
               response: { removeQuery },
           });
       } catch (error) {
       //console.log(error);
       next(new InternalServerErrorException(error));
       }
   }
  @Post('/update/:id')
  @Middleware([validationMiddleware(UpdateCustomerFamilyDTO), authenticateMiddleware])
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
        relation,
        customerId
       
       }: UpdateCustomerFamilyDTO = request.body;
       console.log(request.body);


       const getCustomerQuery = await getRepository(MycoidCustomerFamily)
       .createQueryBuilder('mycoid_customer_family')
       .where('mycoid_customer_family.cust_family_id=:id',{ id: Id})
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

          
          
       const updateQuery = await getRepository(MycoidCustomerFamily)
       .createQueryBuilder('mycoid_customer_family')
       .update()
       .set({image: imageNewLink, customerId: customerId, relation: relation, modifiedDatetime: new Date(), firstName: firstName, lastName: lastName, modifiedby: customerId})
       .where('mycoid_customer_family.cust_family_id=:id',{ id: Id},)
       .execute();
       response.status(200).json({
           status: 200,
           timestamp: Date.now(),
           message: 'customer guest Update Successfully.',
           response: { updateQuery },
       }); 
      } catch (error) {
       //console.log(error);
       next(new InternalServerErrorException(error));
     }
   }
}
export default CustomerfamilyController