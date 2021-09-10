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
import { CompanyTypeDTO, UpdateCompanytypeDTO } from '../dto'
import { getRepository, getConnection } from 'typeorm';
import { MycoidCompanytype } from '../entities';
import { Status } from '../enum';
import { paginate, generatePasscode } from '../util';
import { Utils } from 'handlebars';

@Controller('/companytype')
export class CompanyTypeController {
    @Post('/add')
    //@Middleware(validationMiddleware(CompanyTypeDTO))
    @Middleware([validationMiddleware(CompanyTypeDTO), authenticateMiddleware])
    public async register(request: Request, response: Response, next: NextFunction) {
    try {
        const {
        companyType,
        createdBy,
        }: CompanyTypeDTO = request.body;
        console.log('request.body;',request.body)
        const checkingCompanyTypeAlreadyExistQuery = await getRepository(MycoidCompanytype) 
        .createQueryBuilder('mycoid_companytype')
        .where(
            'mycoid_companytype.compny_type = :compny_type',
            {
            status: [Status.ACTIVIE, Status.INACTIVE],
            compny_type: companyType,
            },
        )
        .getOne();
        if (!checkingCompanyTypeAlreadyExistQuery) {
        const createUserQuery = await getRepository(MycoidCompanytype)
            .createQueryBuilder('mycoid_companytype')
            .insert()
            .into('mycoid_companytype')
            .values({
            ...{ compnyType: companyType, createdDatetime: new Date(), createdby : createdBy, status: Status.ACTIVIE}
            
        })
            .execute();
        
        response.status(200).json({
            status: 200,
            timestamp: Date.now(),
            message: 'company type added successfully.',
            response: {
            
            },
        });
        } else {
            console.log("total err");
            console.log(checkingCompanyTypeAlreadyExistQuery);
        
                if (
                    checkingCompanyTypeAlreadyExistQuery.compnyType == companyType
                ) {
                next(new CommonException(400, "company type already exits"));
                }
            }
       } catch (error) {
         next(new InternalServerErrorException(error));
     }
    }
    // company type updated
    @Post('/update/:id')
    //@Middleware(validationMiddleware(UpdateCompanytypeDTO))
    @Middleware([validationMiddleware(UpdateCompanytypeDTO), authenticateMiddleware])
    private async updateCompanytype(
    request: Request,
    response: Response,
    next: NextFunction,
    ) {
        let Id = parseInt(request.params.id);
        try {
        const {
            companyType,
            modifiedBy,
        }: UpdateCompanytypeDTO = request.body;
        console.log(request.body);
        const updateQuery = await getRepository(MycoidCompanytype)
            .createQueryBuilder('mycoid_companytype')
            .update()
            .set({compnyType: companyType, modifiedDatetime: new Date(), modifiedby : modifiedBy})
            .where('mycoid_companytype.company_type_id=:id',{ id: Id},)
            .execute();
            response.status(200).json({
                status: 200,
                timestamp: Date.now(),
                message: 'Companytype Update Successfully.',
                response: { updateQuery },
            });
        } catch (error) {
        //console.log(error);
        next(new InternalServerErrorException(error));
        }
    }
    // company type remove
    @Post('/remove/:id')
    //@Middleware(validationMiddleware(UpdateCompanytypeDTO))
    @Middleware([authenticateMiddleware])
    private async removeCompanytype(
    request: Request,
    response: Response,
    next: NextFunction,
    ) {
        let Id = parseInt(request.params.id);
        try {
        const updateQuery = await getRepository(MycoidCompanytype)
            .delete({ companyTypeId: Id });
            response.status(200).json({
                status: 200,
                timestamp: Date.now(),
                message: 'Companytype remove Successfully.',
                response: { updateQuery },
            });
        } catch (error) {
        //console.log(error);
        next(new InternalServerErrorException(error));
        }
    }
    //separate company details
    @Get('/:id')
    //@Middleware(authenticateMiddleware)
    public async getItem(request: Request,
    response: Response,
    next: NextFunction) {
    let Id = parseInt(request.params.id);
    let data;
    const getCompanyQuery = await getRepository(MycoidCompanytype)
          .createQueryBuilder('company')
          .select([
            'company.companyTypeId',
            'company.compnyType',
            'company.createdDatetime',
            'company.createdby',
            'company.status'
           ])
         // .innerJoin('users.UserAccess', 'user_access')
          .where(
            'company.company_type_id = :id  AND company.status In (:...status)',
            {
              id: Id,
              status: [Status.ACTIVIE],
             
            },
          )
          .getOne();
        if(getCompanyQuery)
        {
            response.status(200).json({
                status: 200,
                timestamp: Date.now(),
                message: 'company Type data',
                success:true,
                response: { ...getCompanyQuery },
              });
        } else {
          next(new CommonException('404', 'No Record Found'));
        }
    }
    // All company type details
    @Get('/all')
    //@Middleware(authenticateMiddleware)
    @Middleware([authenticateMiddleware])
    public async getAllItem(request: Request,response: Response,next: NextFunction) {
    const getAllCompanyQuery = await getRepository(MycoidCompanytype)
            .createQueryBuilder('mycoid_companytype')
            // .select([
            // 'mycoid_companytype.companyTypeId',
            // 'mycoid_companytype.compnyType',
            // 'mycoid_companytype.createdDatetime',
            // 'mycoid_companytype.createdby',
            // 'mycoid_companytype.status'
            // ])
            // .where('mycoid_companytype.status In (:...status)',{status: [Status.ACTIVIE] })
            .getMany();
        if(getAllCompanyQuery)
        {
            response.status(200).json({
                status: 200,
                timestamp: Date.now(),
                message: 'company Type data',
                success:true,
                response: { ...getAllCompanyQuery },
              });
        } else {
          next(new CommonException('404', 'No Record Found'));
        }
    }
}
export default CompanyTypeController
