import {
  IsString ,
  IsOptional ,
  IsDate ,
  IsEnum ,
  IsNumberString ,
  IsArray , ArrayNotEmpty , IsDateString
} from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export enum FundingType {
  FULLY_FUNDED = 'FULLY_FUNDED',
  PARTIAL_FUNDED = 'PARTIAL_FUNDED',
}
export class CreateScholarshipDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  officialLink?: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  organizationName: string;

  @ApiProperty()
  @IsEnum(FundingType)
  fundingType: FundingType;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  startApplicationDate?: Date;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  endApplicationDate?: Date;

  @ApiProperty()
  @IsString()
  applicationStartPeriod: string;

  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  hostCountriesIds: number[];

  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  studyLevelsIds: number[];
}
