import {
  IsString,
  IsOptional,
  Length,
  IsDate,
  IsEnum,
  IsNumberString,
  IsArray,
} from 'class-validator';

export enum FundingType {
  FULLY_FUNDED = 'FULLY_FUNDED',
  PARTIAL_FUNDED = 'PARTIAL_FUNDED',
}
export class CreateScholarshipDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  officialLink?: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  coverPhoto?: string;

  @IsString()
  organizationName: string;

  @IsEnum(FundingType)
  fundingType: FundingType;

  @IsDate()
  @IsOptional()
  startApplicationDate?: Date;

  @IsDate()
  @IsOptional()
  endApplicationDate?: Date;

  @IsString()
  applicationStartPeriod: string;

  @IsNumberString()
  @IsArray()
  hostCountriesIds: number[];
  @IsNumberString()
  @IsArray()
  studyLevelsIds: number[];
}


