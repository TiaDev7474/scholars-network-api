import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { GetUser } from '../common/decorators/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinioService } from '../common/lib/minio/minio.service';
import { Public } from '../common/decorators/public.decorator';

@Controller('profiles')
export class ProfilesController {
  constructor(
    private readonly profilesService: ProfilesService,
    private readonly minioService: MinioService,
  ) {}
  //todo: Add file interceptor for file upload
  @Post()
  @UseInterceptors(FileInterceptor('profilePicture'))
  async create(
    @GetUser() user: any,
    @Body() createProfileDto: CreateProfileDto,
    @UploadedFile()
    profilePicture?: Express.Multer.File,
  ) {
    const { sub: userId } = user;
    console.log(profilePicture);
    const data = {
      ...createProfileDto,
    };
    if (profilePicture) {
      const filename = await this.minioService.uploadFile(profilePicture);
      data.profilePicture = await this.minioService.getFileUrl(filename);
    }
    return this.profilesService.create(userId, data);
  }
  @Get()
  findAll() {
    return this.profilesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profilesService.findOne(id);
  }
  @Patch(':id')
  @UseInterceptors(FileInterceptor('profilePicture'))
  async update(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile()
    profilePicture?: Express.Multer.File,
  ) {
    const data = {
      ...updateProfileDto,
    };
    if (profilePicture) {
      const filename = await this.minioService.uploadFile(profilePicture);
      data.profilePicture = await this.minioService.getFileUrl(filename);
    }
    return this.profilesService.update(id, data);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profilesService.remove(id);
  }

  @Public()
  @Get('country')
  async getAllCountries() {
    return this.profilesService.getAllCountry();
  }
  @Public()
  @Get('study-level')
  async getAllStudyLevel() {
    return this.profilesService.getAllStudyLevel();
  }
  @Public()
  @Get('academics')
  async getAllAcademics() {
    return this.profilesService.getAllAcademics();
  }
}
