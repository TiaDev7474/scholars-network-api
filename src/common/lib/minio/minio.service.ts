import { Inject } from '@nestjs/common';
import * as Minio from 'minio';
import { ConfigService } from '@nestjs/config';
export class MinioService {
  private readonly bucketName: string;
  constructor(
    @Inject('MINIO_CLIENT') private readonly minioClient: Minio.Client, private readonly configService: ConfigService
  ) {
    this.bucketName = this.configService.get<string>('MINIO_BUCKET_NAME');
  }
  private async createBucketsIfNotExist() {
    const bucketExists = await this.minioClient.bucketExists(this.bucketName);
    if (!bucketExists) {
      await this.minioClient.makeBucket(this.bucketName);
    }
  }

  async uploadFile(file: Express.Multer.File) {
    const filename: string = `${Date.now()}-${file.originalname}`;
    await this.minioClient.putObject(
      this.bucketName,
      filename,
      file.buffer,
      file.size,
    );
    return filename;
  }

  async getFileUrl(filename: string) {
    return await this.minioClient.presignedUrl(
      'GET',
      this.bucketName,
      filename,
    );
  }

  async deleteFile(filename: string) {
    await this.minioClient.removeObject(this.bucketName, filename);
  }
}
