import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProfileDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty()
  @IsOptional()
  @IsUrl()
  profilePicture?: string;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  dateOfBirth?: Date;

  @ApiProperty()
  @IsInt()
  countryId: number;

  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  desiredStudyCountryIds: number[];

  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  academicsInterestIds: number[];

  @ApiProperty()
  @IsInt()
  currentStudyLevelId: number;
}
