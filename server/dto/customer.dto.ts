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
  export class CustomerRegisterDTO {
     
    // @IsString()
    public firstName: string;
    
    //@IsString()
    public lastName: string;

    @IsNotEmpty()
    @Matches(
      /^[_A-Za-z0-9-+]+(.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(.[A-Za-z0-9]+)*(.[A-Za-z]{2,})$/i,
      {
        message: 'Email must be an email',
      },
    )
    public email: string;

    @MinLength(6)
    @IsNotEmpty()
    @IsString()
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
  }
 
  export class CustomerLogInDTO {
    //@IsNotEmpty()
    // @Matches(
    //   /^[_A-Za-z0-9-+]+(.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(.[A-Za-z0-9]+)*(.[A-Za-z]{2,})$/i,
    //   {
    //     message: 'Email must be an email',
    //   },
    // )
    // @IsString()
    // public email: string;
  
    @MinLength(10)
  //  @IsNotEmpty()
    public emailOrMobile: string;

    @MinLength(6)
    @IsNotEmpty()
    @IsString()
    public password: string;
  
    
  }
  export class CustomerChangePasswordDTO {
    @MinLength(6)
    @IsNotEmpty()
    @IsString()
    public oldPassword: string;
  
    @MinLength(6)
    @IsNotEmpty()
    @IsString()
    public password: string;
  }

  export class CustomerFamilyRegisterDTO {

    @IsNotEmpty()
    public customerId:number
     
    // @IsString()
    public firstName: string;
    
    //@IsString()
    public lastName: string;

  //@IsString()
    public relation: string;
}

export class UpdateCustomerFamilyDTO {

  @IsNotEmpty()
  public customerId:number
   
  // @IsString()
  public firstName: string;
  
  //@IsString()
  public lastName: string;

//@IsString()
  public relation: string;
}

//   export class CustomerSendResetPasswordLinkDTO {
//     @IsNotEmpty()
//     @Matches(
//       /^[_A-Za-z0-9-+]+(.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(.[A-Za-z0-9]+)*(.[A-Za-z]{2,})$/i,
//       {
//         message: 'user must be an email',
//       },
//     )
//     public email: string;
//   }


//   export class CustomerCreatePasswordDTO {
    
//     @IsNotEmpty()
//     @IsString()
//     public verifyToken: string;
  
//     @MinLength(6)
//     @IsNotEmpty()
//     @IsString()
//     public password: string;
//   }
//   export class AddRoleDTO {
        
//     // @IsString()
//      public reoleName: string;
     
//      //@IsString()
//      public roledescription: string;
 
    
//    }

  export class UpdateCustomerDTO{
    
    @IsNotEmpty()
    public id:number
   
   // @IsString()
   public firstName: string;
   
   //@IsString()
   public lastName: string;

   @IsNotEmpty()
   @Matches(
     /^[_A-Za-z0-9-+]+(.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(.[A-Za-z0-9]+)*(.[A-Za-z]{2,})$/i,
     {
       message: 'Email must be an email',
     },
   )
   public email: string;

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
  export const CustomerSchemas = validationMetadatasToSchemas(metadatas)


