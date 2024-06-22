import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ScholarshipsRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(params: {
    data: Prisma.ScholarshipCreateInput;
    include: Prisma.ScholarshipInclude;
  }) {
    const { data } = params;
    return this.prisma.scholarship.create({
      data,
    });
  }
  async update(params: {
    where: Prisma.ScholarshipWhereUniqueInput;
    data: Prisma.ScholarshipUpdateInput;
  }) {
    const { where, data } = params;
    return this.prisma.scholarship.update({
      where,
      data,
    });
  }
  async remove(params: { where: Prisma.ScholarshipWhereUniqueInput }) {
    const { where } = params;
    return this.prisma.scholarship.delete({
      where,
    });
  }
  async findAll(params: { where: Prisma.ScholarshipWhereInput }) {
    const { where } = params;
    return this.prisma.scholarship.findMany({
      where,
    });
  }
  async findOne(params: { where: Prisma.ScholarshipWhereUniqueInput }) {
    const { where } = params;
    return this.prisma.scholarship.findUnique({
      where,
    });
  }
}
