import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../common/database/prisma.service';

@Injectable()
export class ProfilesRepository {
  constructor(private readonly prisma: PrismaService) {}
  create(data: Prisma.ProfileCreateInput) {
    return this.prisma.profile.create({
      data,
    });
  }

  findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ProfileWhereUniqueInput;
    where?: Prisma.ProfileWhereInput;
    orderBy?: Prisma.ProfileOrderByWithRelationInput;
  }) {
    return this.prisma.profile.findMany({
      ...params,
    });
  }

  findOne(id: Prisma.ProfileWhereUniqueInput['id']) {
    return this.prisma.profile.findUnique({
      where: {
        id,
      },
    });
  }

  update(params: {
    where: Prisma.ProfileWhereUniqueInput;
    data: Prisma.ProfileUpdateInput;
  }) {
    const { where, data } = params;
    return this.prisma.profile.update({
      data,
      where,
    });
  }
  remove(id: Prisma.ProfileWhereUniqueInput['id']) {
    return this.prisma.profile.delete({
      where: {
        id,
      },
    });
  }
}
