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
import { CreateBranchDTO, UpdateBranchDTO, UpdateBranchopeningHoursDTO, UpdateBranchHolidayDTO } from '../dto'
import { getRepository, getConnection } from 'typeorm';
import { MycoidUsers, MycoidBranch, MycoidHolidayVacation, MycoidOpeningHours } from '../entities';
import { Status } from '../enum';
import { paginate, generatePasscode, uploadImages, imageUnlink } from '../util';
import { Utils } from 'handlebars';

@Controller('/branch')
export class BranchController {
  /***
   * GetAll branch details
   */
  @Get('/all')
  //@Middleware(authenticateMiddleware)
  public async index(request: Request, response: Response, next: NextFunction) {
    //var { currentPage, maxPages, pageSize } = request.query;
    var currentPage, maxPages, pageSize;
    currentPage = request.query.currentPage;
    maxPages = request.query.maxPages;
    pageSize = request.query.pageSize;
    console.log("requestquery" + request.query.currentPage);
    console.log("requestquery" + request.query.maxPages);
    console.log("requestquery" + request.query.pageSize);
    currentPage = currentPage ? currentPage : 1;
    maxPages = maxPages ? maxPages : 1;
    pageSize = pageSize && pageSize <= 100 ? pageSize : 10;
    const productCountQuery = await MycoidBranch.count();
    if (productCountQuery) {
      const paginationData = paginate(
        productCountQuery,
        parseInt(currentPage),
        parseInt(pageSize),
        parseInt(maxPages),
      );

      let PaginationQuery;
      PaginationQuery = await getRepository(MycoidBranch)
        .createQueryBuilder('mycoid_branch')
        .where(`mycoid_branch.status In (:...status)`, { status: [Status.ACTIVIE, Status.INACTIVE] })
        .skip(paginationData.startIndex)
        .take(paginationData.pageSize)
        .orderBy('branch_id', 'DESC')
        .getMany();
      let result = [];
      PaginationQuery.map(function (branch, index) {

        result.push(branch);
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
  /***
   * Separate branch details
   */
  @Get('/:id')
  @Middleware([authenticateMiddleware])
  public async getItem(request: Request,
    response: Response,
    next: NextFunction) {
    let Id = parseInt(request.params.id);
    let data;
    const getBranchQuery = await getRepository(MycoidBranch)
      .createQueryBuilder('mycoid_branch')
      .where('mycoid_branch.branch_id = :id  AND mycoid_branch.status In (:...status)',
        { id: Id, status: [Status.ACTIVIE, Status.INACTIVE], })
      .getOne();
    if (getBranchQuery) {
      const getBranchHolidayQuery = await getRepository(MycoidHolidayVacation)
        .createQueryBuilder('mycoid_holiday_vacation')
        .where('mycoid_holiday_vacation.branch_id = :id  AND mycoid_holiday_vacation.status In (:...status)',
          { id: Id, status: [Status.ACTIVIE, Status.INACTIVE], })
        .getMany();
      const getBranchOpeningHoursQuery = await getRepository(MycoidOpeningHours)
        .createQueryBuilder('mycoid_opening_hours')
        .where('mycoid_opening_hours.branch_id = :id  AND mycoid_opening_hours.status In (:...status)',
          { id: Id, status: [Status.ACTIVIE, Status.INACTIVE], })
        .getMany();
      response.status(200).json({
        status: 200,
        timestamp: Date.now(),
        message: 'branch data',
        success: true,
        response: { "branch": getBranchQuery, "holidayVaction": getBranchHolidayQuery, "openingHours": getBranchOpeningHoursQuery },
      });
    } else {
      next(new CommonException('404', 'No Record Found'));
    }
  }
  /***
 * GetAll branch details based User
 */
  @Get('/user/:id')
  @Middleware([authenticateMiddleware])
  public async getBranchUser(request: Request, response: Response, next: NextFunction) {
    let Id = parseInt(request.params.id);
    if(!Id || Id==NaN)   
      return next(new CommonException('404', 'No Record Found')); 
    // var { currentPage, maxPages, pageSize } = request.query;
    var currentPage, maxPages, pageSize;
    currentPage = request.query.currentpage;
    maxPages = request.query.maxPages;
    pageSize = request.query.pageSize;
    currentPage = currentPage ? currentPage : 1;
    maxPages = maxPages ? maxPages : 1;
    pageSize = pageSize && pageSize <= 100 ? pageSize : 10;
    const productCountQuery = await getRepository(MycoidBranch)
      .createQueryBuilder('mycoid_branch')
      .where('mycoid_branch.user_id = :id', { id: Id, })
      .getCount();
    if (productCountQuery) {
      const paginationData = paginate(
        productCountQuery,
        parseInt(currentPage),
        parseInt(pageSize),
        parseInt(maxPages),
      );

      console.log('paginationDatapaginationDatapaginationData', paginationData);
      let PaginationQuery;
      PaginationQuery = await getRepository(MycoidBranch)
        .createQueryBuilder('mycoid_branch')
        .where(`mycoid_branch.user_id = :id`, { id: Id })
        .skip(paginationData.startIndex)
        .take(paginationData.pageSize)
        .orderBy('branch_id', 'DESC')
        .getMany();
      let result = [];
      PaginationQuery.map(function (branch, index) {

        result.push(branch);
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
  /***
   * Remove Branch
   */
  @Post('/remove/:id')
  @Middleware([authenticateMiddleware])
  private async removeBranch(request: Request, response: Response, next: NextFunction, ) {
    let Id = parseInt(request.params.id);
    try {
      const updateQuery = await getRepository(MycoidBranch)
        .delete({ branchId: Id });
      response.status(200).json({
        status: 200,
        timestamp: Date.now(),
        message: 'Branch remove Successfully.',
        response: { updateQuery },
      });
    } catch (error) {
      //console.log(error);
      next(new InternalServerErrorException(error));
    }
  }
  /***
   * Add branch details
   */
  @Post('/add')
  @Middleware([validationMiddleware(CreateBranchDTO), authenticateMiddleware])
  //@Middleware(validationMiddleware(CreateBranchDTO))
  public async createBranch(request: Request, response: Response, next: NextFunction, ) {
    try {
      const {
        userId,
        branchName,
        vacationDate,
        reason,
        holidayDate,
        vacationToDate,
        holidayReason,
        openingHours,
        days,
        guestNo,
        telephone,
        email,
        website,
        address,
        postcode,
        city,
        place,
        country,
        createdBy,
      }: CreateBranchDTO = request.body;
      console.log('request.body;', request.body)
      const checkingBranchAlreadyExistQuery = await getRepository(MycoidBranch)
        .createQueryBuilder('mycoid_branch')
        .where(
          'mycoid_branch.status IN (:...status) AND mycoid_branch.email = :email',
          { status: [Status.ACTIVIE, Status.INACTIVE], email: email })
        .getOne();
      if (!checkingBranchAlreadyExistQuery) {
        let imageData = "";
        let imageNewLink = "";
        // await uploadImages(request, response)
        //   .then(getalldata => {
        //     imageData = getalldata['upload'];
        //     imageNewLink = getalldata['saveImage'];
        //   })
        //   .catch(err => {

        //   })
        if(request.body.uploadedData){
          imageData = request.body.uploadedData['upload'];
          imageNewLink = request.body.uploadedData['saveImage'];
        }
        if (imageData != "1") {
          imageNewLink = "";
        }
        const createBranchQuery = await getRepository(MycoidBranch)
          .createQueryBuilder('mycoid_branch')
          .insert()
          .into('mycoid_branch')
          .values({
            ...{ image: imageNewLink, user: userId, branchName: branchName, telephone: telephone, email: email, website: website, address: address, postcode: postcode, place: place, city: city, country: country, status: Status.ACTIVIE, createdDatetime: new Date(), createdby: createdBy, guestno: guestNo },
          })
          .execute();
        const brancAddedId = createBranchQuery.generatedMaps[0].branchId;
        let cc = createBranchQuery.generatedMaps[0].branchId;
        if (createBranchQuery) {
          // Vacation insert
          if (vacationDate.length > 0) {
            let recordsToSave = [];
            var i = 0;
            for (i = 0; i < vacationDate.length; i++) {
              let it2Save = {
                type: 1,
                date: vacationDate[i],
                toDate: vacationToDate[i],
                reason: reason[i],
                branchId: brancAddedId,
                createdDatetime: new Date(),
                createdby: createdBy,
                status: 1
              }
              recordsToSave.push(it2Save);
            }
            console.log(recordsToSave);
            const checkingVaction = await getRepository(MycoidHolidayVacation)
              .save(recordsToSave);
          }
          // Holiday insert
          if (holidayDate.length > 0) {
            let holidayRecordsToSave = [];
            var i = 0;
            for (i = 0; i < holidayDate.length; i++) {
              let holiday_data = {
                type: 2,
                date: holidayDate[i],
                reason: holidayReason[i],
                branchId: brancAddedId,
                createdDatetime: new Date(),
                createdby: createdBy,
                status: 1
              }
              holidayRecordsToSave.push(holiday_data);
            }
            console.log(holidayRecordsToSave);
            const checkingHoliday = await getRepository(MycoidHolidayVacation)
              .save(holidayRecordsToSave);

          }
          // opening Hours insert
          if (openingHours.length > 0) {
            let openingHoursRecordsToSave = [];
            var i = 0;
            for (i = 0; i < openingHours.length; i++) {
              let open_hours = {
                days: days[i],
                openingHours: openingHours[i],
                branchId: brancAddedId,
                createdDatetime: new Date(),
                createdby: createdBy,
                status: 1
              }
              openingHoursRecordsToSave.push(open_hours);
            }
            console.log(openingHoursRecordsToSave);
            const checkingOpeningHours = await getRepository(MycoidOpeningHours)
              .save(openingHoursRecordsToSave);
          }
          response.status(200).json({
            status: 200,
            timestamp: Date.now(),
            message: 'Branch added successfully.',
            response: {
              id: createBranchQuery.generatedMaps[0].branchId,

            },
          });
        }

      } else {

        if (checkingBranchAlreadyExistQuery.email == email) {
          next(new UserWithThatEmailAlreadyExistsException(email));
        }

      }
    } catch (error) {
      next(new InternalServerErrorException(error));
    }
  }
  /***
  * Update branch details
  */
  @Post('/update/:id')
  @Middleware([validationMiddleware(UpdateBranchDTO), authenticateMiddleware])
  private async updateBranch(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      let Id = parseInt(request.params.id);
      const {
        id,
        branchName,
        telephone,
        vacationDate,
        vacationToDate,
        reason,
        holidayDate,
        holidayReason,
        openingHours,
        days,
        guestNo,
        email,
        website,
        address,
        postcode,
        city,
        place,
        country,
        branchStatus,
        modifiedBy
      }: UpdateBranchDTO = request.body;
      let imageData = "";
      let imageNewLink = "";
      let oldImage = "";
      const getBranchQuery = await getRepository(MycoidBranch)
        .createQueryBuilder('mycoid_branch')
        .where('mycoid_branch.branch_id=:id  AND mycoid_branch.status In (:...status)',
          { id: Id, status: [Status.ACTIVIE, Status.INACTIVE], })
        .getOne();
      oldImage = getBranchQuery.image;
     // console.log('oldImageoldImageoldImage===',oldImage);
     // console.log('uploadedDatauploadedDatauploadedData===',request.body.uploadedData);
      if(request.body.uploadedData){
        imageData = request.body.uploadedData['upload'];
        imageNewLink = request.body.uploadedData['saveImage'];
      }
      // await uploadImages(request, response)
      //   .then(getalldata => {
      //     console.log('getalldata===',getalldata)
      //    // imageData = getalldata['upload'];
      //    // imageNewLink = getalldata['saveImage'];
      //   })
      //   .catch(err => {
      //     console.log('errr===',err)
      //   })
      if (imageData != "1" && oldImage == "") {
        imageNewLink = "";
      }
      else if (imageData != "1" && oldImage != "") {
        imageNewLink = oldImage;
      }
      else if (imageData == "1" && oldImage != "") {
        let imagRemove = imageUnlink(oldImage);
      }
      console.log('imageNewLinkimageNewLinkimageNewLink',imageNewLink)
      const updateQuery = await getRepository(MycoidBranch)
        .createQueryBuilder('mycoid_branch')
        .update()
        .set({ image: imageNewLink, branchName: branchName,telephone: telephone, email: email, website: website, address: address, postcode: postcode, place: place, city: city, country: country, modifiedDatetime: new Date(), modifiedby: modifiedBy, status: (branchStatus?branchStatus:Status.ACTIVIE), guestno: guestNo, })
        .where('mycoid_branch.branch_id=:id', { id: Id })
        .execute();
      if (updateQuery) {
        const removeTimeQuery = await getRepository(MycoidHolidayVacation)
          .delete({ branchId: Id });
        const removeOpenQuery = await getRepository(MycoidOpeningHours)
          .delete({ branchId: Id });
        // Vacation insert
        if (vacationDate.length > 0) {
          let recordsToSave = [];
          var i = 0;
          for (i = 0; i < vacationDate.length; i++) {
            let it2Save = {
              type: 1,
              date: vacationDate[i],
              toDate: vacationToDate[i],
              reason: reason[i],
              branchId: Id,
              createdDatetime: new Date(),
              createdby: modifiedBy,
              modifiedby: modifiedBy,
              status: 1
            }
            recordsToSave.push(it2Save);
          }
          console.log(recordsToSave);
          const checkingVaction = await getRepository(MycoidHolidayVacation)
            .save(recordsToSave);
        }
        // Holiday insert
        if (holidayDate.length > 0) {
          let holidayRecordsToSave = [];
          var i = 0;
          for (i = 0; i < holidayDate.length; i++) {
            let holiday_data = {
              type: 2,
              date: holidayDate[i],
              reason: holidayReason[i],
              branchId: Id,
              createdDatetime: new Date(),
              createdby: modifiedBy,
              modifiedby: modifiedBy,
              status: 1
            }
            holidayRecordsToSave.push(holiday_data);
          }
          console.log(holidayRecordsToSave);
          const checkingHoliday = await getRepository(MycoidHolidayVacation)
            .save(holidayRecordsToSave);

        }
        // opening Hours insert
        if (openingHours.length > 0) {
          let openingHoursRecordsToSave = [];
          var i = 0;
          for (i = 0; i < openingHours.length; i++) {
            let open_hours = {
              days: days[i],
              openingHours: openingHours[i],
              branchId: Id,
              createdDatetime: new Date(),
              createdby: modifiedBy,
              modifiedby: modifiedBy,
              status: 1
            }
            openingHoursRecordsToSave.push(open_hours);
          }
          console.log(openingHoursRecordsToSave);
          const checkingOpeningHours = await getRepository(MycoidOpeningHours)
            .save(openingHoursRecordsToSave);
        }
        response.status(200).json({
          status: 200,
          timestamp: Date.now(),
          message: 'Branch Update Successfully.',
          response: { updateQuery },
        });
      }

    } catch (error) {
      //console.log(error);
      next(new InternalServerErrorException(error));
    }
  }
  /***
  * Holiday Vacation Update
  */
  @Post('/holidayvacation/update/:id')
  @Middleware([validationMiddleware(UpdateBranchHolidayDTO), authenticateMiddleware])
  private async updateBranchHoliday(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      let Id = parseInt(request.params.id);
      const {
        holidayVacationDate,
        holidayVacationToDate,
        reason,
        modifiedBy
      }: UpdateBranchHolidayDTO = request.body;

      const updateQuery = await getRepository(MycoidHolidayVacation)
        .createQueryBuilder('mycoid_holiday_vacation')
        .update()
        .set({ reason: reason, date: holidayVacationDate,toDate:holidayVacationToDate, modifiedDatetime: new Date(), modifiedby: modifiedBy })
        .where('mycoid_holiday_vacation.holiday_vacation_id=:id', { id: Id })
        .execute();
      if (updateQuery) {
        response.status(200).json({
          status: 200,
          timestamp: Date.now(),
          message: 'Branch holiday vacation Update Successfully.',
          response: { updateQuery },
        });
      }

    } catch (error) {
      //console.log(error);
      next(new InternalServerErrorException(error));
    }
  }
  /***
   * Opening Hours Update
   */
  @Post('/openinghours/update/:id')
  @Middleware([validationMiddleware(UpdateBranchopeningHoursDTO), authenticateMiddleware])
  private async updateBranchOpeningHours(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      let Id = parseInt(request.params.id);
      const {
        openingTime,
        days,
        modifiedBy
      }: UpdateBranchopeningHoursDTO = request.body;

      const updateQuery = await getRepository(MycoidOpeningHours)
        .createQueryBuilder('mycoid_opening_hours')
        .update()
        .set({ days: days, openingHours: openingTime, modifiedDatetime: new Date(), modifiedby: modifiedBy })
        .where('mycoid_opening_hours.opening_hours_id=:id', { id: Id })
        .execute();
      if (updateQuery) {
        response.status(200).json({
          status: 200,
          timestamp: Date.now(),
          message: 'Branch opening Hours Update Successfully.',
          response: { updateQuery },
        });
      }

    } catch (error) {
      //console.log(error);
      next(new InternalServerErrorException(error));
    }
  }

}
export default BranchController