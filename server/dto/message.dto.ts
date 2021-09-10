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
    IsArray,
    ValidateNested,
    ArrayMinSize,
  } from 'class-validator';
  import { validationMetadatasToSchemas } from 'class-validator-jsonschema'
import { Type } from 'class-transformer';


  
  
  class Visitors {
     // @IsString()
     public userId: number;
    
     public branchuserId: number;

     @IsNotEmpty()
     public branchId: number;
 
     @IsNotEmpty()
     public customerId: number;

    
     public createdBy: string;
  }

  export class MessageCreateDTO {
     
    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @Type(() => Visitors)
    visitors: Visitors[];

    @IsNotEmpty()
    public message: string;

   
   }


   export class SupportDTO {
     
    // @IsString()
    @IsNotEmpty()
    public firstName: string;
    
    @IsNotEmpty()
    public lastName: string

    @IsNotEmpty()
    public company: string

    @IsNotEmpty()
    @Matches(
      /^[_A-Za-z0-9-+]+(.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(.[A-Za-z0-9]+)*(.[A-Za-z]{2,})$/i,
      {
        message: 'Email must be an email',
      },
    )
    public email: string

    @IsNotEmpty()
    public message: string;


   }
 
  const metadatas = (getFromContainer(MetadataStorage) as any).validationMetadatas
  export const MessageSchemas = validationMetadatasToSchemas(metadatas)


