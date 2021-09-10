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
  export class CompanyTypeDTO {
     
    // @IsString()
    public companyType: string;

    // @IsString()
    public createdBy: number;
    
  }
  export class UpdateCompanytypeDTO {
     
    @IsNotEmpty()
    public id:number

    // @IsString()
    @IsNotEmpty()
    public companyType: string;
    
    // @IsString()
    @IsNotEmpty()
    public modifiedBy: number;
    
  }

  


  const metadatas = (getFromContainer(MetadataStorage) as any).validationMetadatas
  export const CompanyTypeSchemas = validationMetadatasToSchemas(metadatas)


