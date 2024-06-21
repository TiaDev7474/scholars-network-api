import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/database/prisma.service';

@Injectable()
export class ScholarshipsRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create() {}
  async update() {}
  async remove() {}
  async findAll() {}
  async findOne() {}
}
