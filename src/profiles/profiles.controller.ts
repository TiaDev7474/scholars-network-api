import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { GetUser } from '../common/decorators/user.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MinioService } from '../common/lib/minio/minio.service';

@Controller('profiles')
export class ProfilesController {
  constructor(
    private readonly profilesService: ProfilesService,
    private readonly minioService: MinioService,
  ) {}
  //todo: Add file interceptor for file upload
  @Post()
  @UseInterceptors(FilesInterceptor('profilePicture'))
  async create(
    @GetUser() user: any,
    @Body() createProfileDto: CreateProfileDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const { sub: userId } = user;
    const data = {
      profilePicture: null,
      ...createProfileDto,
    };
    if (file) {
      data.profilePicture = await this.minioService.uploadFile(file);
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
  @UseInterceptors(FilesInterceptor('profilePicture'))
  async update(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const data = {
      profilePicture: null,
      ...updateProfileDto,
    };
    if (file) {
      data.profilePicture = await this.minioService.uploadFile(file);
    }
    return this.profilesService.update(id, data);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profilesService.remove(id);
  }
}
