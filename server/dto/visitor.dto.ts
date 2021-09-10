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
  export class CheckinDTO {
     
    // @IsString()
    public userId: number;
    
    //@IsString()
    public branchId: number;

    //@IsString()
    public customerId: number;

    @IsNotEmpty()
    public createdBy: string;
   }
   export class CheckoutDTO {

    // @IsString()
    public visitorId: number;
     
    // @IsString()
    public userId: number;
    
    //@IsString()
    public branchId: number;

    //@IsString()
    public customerId: number;

   @IsNotEmpty()
    public createdBy: string;
   }
 
  const metadatas = (getFromContainer(MetadataStorage) as any).validationMetadatas
  export const VisitorSchemas = validationMetadatasToSchemas(metadatas)


