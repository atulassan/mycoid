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
  export class UserRegisterDTO {
     
    // @IsString()
    public companyTypeId: number;

    // @IsString()
    @IsNotEmpty()
    public companyName: string;

    // @IsString()
    public firstName: string;
    
    //@IsString()
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
    public contactperson: string;

    //@IsString()
    public website: string;

    //@IsString()
    public extraInfo: string;

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
  }
  export class SuperUserRegisterDTO {
     
    // @IsString()
    public companyTypeId: number;
    // @IsString()
    public firstName: string;
    
    //@IsString()
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
    public contactperson: string;

    //@IsString()
    public website: string;

    //@IsString()
    public extraInfo: string;

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

    @MinLength(6)
    @IsNotEmpty()
    @IsString()
    public password: string;
  
  }
  export class LogInDTO {
    @IsNotEmpty()
    @Matches(
      /^[_A-Za-z0-9-+]+(.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(.[A-Za-z0-9]+)*(.[A-Za-z]{2,})$/i,
      {
        message: 'Email must be an email',
      },
    )
    @IsString()
    public email: string;
  
    @MinLength(6)
    @IsNotEmpty()
    @IsString()
    public password: string;

    public userType: string
  
    
  }
  export class UserChangePasswordDTO {
    @MinLength(6)
    @IsNotEmpty()
    @IsString()
    public oldPassword: string;
  
    @MinLength(6)
    @IsNotEmpty()
    @IsString()
    public password: string;
  }
  export class VerifyTokenDTO{
    // @IsString()
    // public email: string;
    
    @IsNotEmpty()
    verifyToken:string;
  }
  export class SendResetPasswordLinkDTO {
    @IsNotEmpty()
    @Matches(
      /^[_A-Za-z0-9-+]+(.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(.[A-Za-z0-9]+)*(.[A-Za-z]{2,})$/i,
      {
        message: 'user must be an email',
      },
    )
    public email: string;
  }


  export class CreatePasswordDTO {
    
    @IsNotEmpty()
    @IsString()
    public verifyToken: string;
  
    @MinLength(6)
    @IsNotEmpty()
    @IsString()
    public password: string;
  }
  export class AddRoleDTO {
        
    // @IsString()
     public reoleName: string;
     
     //@IsString()
     public roledescription: string;
 
    
   }

  export class UpdateUserDTO{
    
    @IsNotEmpty()
    public id:number

    // @IsString()
    @IsNotEmpty()
    public companyName: string;
   
   // @IsString()
   public firstName: string;
   
   //@IsString()
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
   public contactperson: string;

   //@IsString()
   public website: string;

   //@IsString()
   public extraInfo: string;

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
   
   //@IsString()
   public modifiedBy: number;

  }
  const metadatas = (getFromContainer(MetadataStorage) as any).validationMetadatas
  export const UserSchemas = validationMetadatasToSchemas(metadatas)


