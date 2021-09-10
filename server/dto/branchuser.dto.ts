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
  
  export class CreateBranchUserDTO {
    @IsNotEmpty()
    public branchId: number;

    @IsNotEmpty()
    public branchUserRole: number;

    @IsNotEmpty()
    public userId: number;

    @IsNotEmpty()
    @IsString()
    public firstName: string;

    @IsNotEmpty()
    @IsString()
    public lastName: string;

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
   public userPosition: string;
   //@IsString()
   public password: string;

   @MinLength(10)
   @IsNotEmpty()
   public mobile: string;
   
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

   @IsNotEmpty()
   public createdBy: number;
  }

  export class UpdateBranchUserDTO{
    @IsNotEmpty()
    public id:number

    @IsNotEmpty()
    public branchId: number;

    @IsNotEmpty()
    public branchUserRole: number;

    //@IsNotEmpty()
    public userId: number;

    @IsNotEmpty()
    @IsString()
    public firstName: string;

    @IsNotEmpty()
    @IsString()
    public lastName: string;

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
   public userPosition: string;
   //@IsString()
   public password: string;

   @MinLength(10)
   @IsNotEmpty()
   public mobile: string;
   
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

   @IsNotEmpty()
   public modifiedBy: number;

   @IsNotEmpty()
   public userStatus: number;

  }
  const metadatas = (getFromContainer(MetadataStorage) as any).validationMetadatas
  export const BranchUserSchemas = validationMetadatasToSchemas(metadatas)


