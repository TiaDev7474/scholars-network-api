import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { ScholarshipsService } from './scholarships.service';
import { CreateScholarshipDto } from './dto/create-scholarship.dto';
import { UpdateScholarshipDto } from './dto/update-scholarship.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinioService } from '../common/lib/minio/minio.service';
import { GetUser } from '../common/decorators/user.decorator';

@Controller('scholarships')
export class ScholarshipsController {
  constructor(
    private readonly scholarshipsService: ScholarshipsService,
    private readonly minioService: MinioService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('coverPhoto'))
  async create(
    @Body() createScholarshipDto: CreateScholarshipDto,
    @UploadedFile() coverPhoto: Express.Multer.File,
  ) {
    const filename: string = await this.minioService.uploadFile(coverPhoto);
    const coverPhotoUrl = await this.minioService.getFileUrl(filename);
    return this.scholarshipsService.create(createScholarshipDto, coverPhotoUrl);
  }

  @Get()
  findAll(
    @Query('hostCountry') hostCountry: string,
    @Query('q') q: string,
    @Query('studyLevel') studyLevel: string,
  ) {
    const filterOptions = {
      countryId: hostCountry,
      q,
      studyLevelId: studyLevel,
    };
    Object.keys(filterOptions).forEach(
      (key) => filterOptions[key] === undefined && delete filterOptions[key],
    );
    return this.scholarshipsService.findAll({ filterOptions });
  }
  @Get('/recommendation')
  getScholarshipRecommendation(
    @Query('take') take: number,
    @GetUser() user: any,
  ) {
    return this.scholarshipsService.getScholarshipRecommendation(
      user.sub,
      take,
    );
  }
  @Get()
  async geUpComingScholarship(@Query('take') take?: number) {
    return this.scholarshipsService.getUpComingScholarship(Number(take));
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scholarshipsService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('coverPhoto'))
  async update(
    @Param('id') id: string,
    @Body() updateScholarshipDto: UpdateScholarshipDto,
    @UploadedFile() coverPhoto?: Express.Multer.File,
  ) {
    let coverPhotoUrl: string;
    if (coverPhoto) {
      const filename: string = await this.minioService.uploadFile(coverPhoto);
      coverPhotoUrl = await this.minioService.getFileUrl(filename);
    }

    return this.scholarshipsService.update(
      id,
      updateScholarshipDto,
      coverPhotoUrl,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scholarshipsService.remove(id);
  }
}
