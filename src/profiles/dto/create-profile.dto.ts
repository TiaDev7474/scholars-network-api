import {
  ArrayNotEmpty ,
  IsArray ,
  IsDate ,
  IsInt , IsNumberString ,
  IsOptional ,
  IsString ,
  IsUrl
} from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateProfileDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty()
  @IsOptional()
  profilePicture?: string;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  dateOfBirth?: Date;

  @ApiProperty()
  @IsNumberString()
  countryId: number;

  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  desiredStudyCountryIds: number[];

  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  academicsInterestIds: number[];

  @ApiProperty()
  @IsNumberString()
  currentStudyLevelId: number;
}
