import {
    IsString,
    IsNotEmpty,
    MinLength,
    IsInt,
    IsEmail,
    Matches,
    IsNumber,
    Min,
    Max,
    getFromContainer,
    MetadataStorage,
    IsNumberString,
  } from 'class-validator';
  import { validationMetadatasToSchemas } from 'class-validator-jsonschema'
  
  export class CreateBranchDTO {
    @IsNotEmpty()
    //@IsString()
    public userId: number;

    //@IsNotEmpty()
    //@IsString()
    public vacationDate: string;

    public vacationToDate: string;
    //@IsNotEmpty()
    //@IsString()
    public reason: string;

    //@IsNotEmpty()
    //@IsString()
    public holidayDate: string;

    //@IsNotEmpty()
    //@IsString()
    public holidayReason: string;

    //@IsNotEmpty()
    //@IsString()
    public openingHours: string;
    //@IsNotEmpty()
    //@IsString()
    public days: string;

    @IsNotEmpty()
    @IsString()
    public branchName: string;

    @MinLength(10)
    @IsNotEmpty()
    public telephone: string;

    @IsNotEmpty()
    @Matches(
     /^[_A-Za-z0-9-+]+(.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(.[A-Za-z0-9]+)*(.[A-Za-z]{2,})$/i,
     {
       message: 'Email must be an email',
     },
    )
    public email: string;

    //@IsString()
     public website: string;

    //@IsString()
    public address: string;

    //@IsString()
    public postcode: string;

    //@IsString()
    public city: string;

    //@IsString()
    public place: string;

    //@IsString()
    public country: string;
    //@IsString()
    public createdBy: string;

    @IsNotEmpty()
    public guestNo:number
  }

  export class UpdateBranchDTO{
    @IsNotEmpty()
    public id:number

    //@IsNotEmpty()
    //@IsString()
    public userId: number;

    @IsNotEmpty()
    @IsString()
    public branchName: string;

    //@IsNotEmpty()
    //@IsString()
    public vacationDate: string;

    public vacationToDate: string;

    //@IsNotEmpty()
    //@IsString()
    public reason: string;

    //@IsNotEmpty()
    //@IsString()
    public holidayDate: string;

    //@IsNotEmpty()
    //@IsString()
    public holidayReason: string;

    //@IsNotEmpty()
    //@IsString()
    public openingHours: string;
    //@IsNotEmpty()
    //@IsString()
    public days: string;

    @MinLength(10)
    @IsNotEmpty()
    public telephone: string;

    @IsNotEmpty()
    @Matches(
     /^[_A-Za-z0-9-+]+(.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(.[A-Za-z0-9]+)*(.[A-Za-z]{2,})$/i,
     {
       message: 'Email must be an email',
     },
    )
    public email: string;

    //@IsString()
     public website: string;

   //@IsString()
    public address: string;

    //@IsString()
    public postcode: string;

    //@IsString()
    public city: string;

    //@IsString()
    public place: string;

    //@IsString()
    public country: string;
    
    //@IsString()
    public branchStatus: number;

    //@IsString()
    public modifiedBy: string;


    @IsNotEmpty()
    public guestNo:number

    

  }
  export class UpdateBranchopeningHoursDTO{
   public openingHours: string;
    @IsNotEmpty()
    //@IsString()
    public days: string;

    @IsNotEmpty()
    //@IsString()
    public openingTime: string;

    //@IsString()
    public modifiedBy: number;

}
export class UpdateBranchHolidayDTO{
  public openingHours: string;
   @IsNotEmpty()
   //@IsString()
   public reason: string;

   @IsNotEmpty()
   //@IsString()
   public holidayVacationDate: string;

   public holidayVacationToDate: string;
   //@IsString()
   public modifiedBy: number;

}
  const metadatas = (getFromContainer(MetadataStorage) as any).validationMetadatas
  export const BranchSchemas = validationMetadatasToSchemas(metadatas)


