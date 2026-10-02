import { ConflictException, Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';

@Injectable()
export class AccountsService {
  constructor(private readonly prisma: PrismaService) {}

  async findCompanyAccounts(companyId: string) {
    return this.prisma.account.findMany({
      where: {
        companyId,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async create(companyId: string, dto: CreateAccountDto) {
    const existingAccount = await this.prisma.account.findFirst({
      where: {
        companyId,
        name: dto.name,
      },
    });

    if (existingAccount) {
      throw new ConflictException('Account already exists');
    }

    return this.prisma.account.create({
      data: {
        companyId,
        name: dto.name,
        type: dto.type as any,
        code: dto.code,
      },
    });
  }
}
