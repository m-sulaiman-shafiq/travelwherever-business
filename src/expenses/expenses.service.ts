import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, companyId: string, dto: CreateExpenseDto) {
    return this.prisma.expense.create({
      data: {
        companyId,
        employeeId: userId,
        category: dto.category,
        description: dto.description,
        amount: dto.amount,
        vatAmount: dto.vatAmount,
        currency: dto.currency ?? 'AED',
        expenseDate: new Date(dto.expenseDate),
        receiptUrl: dto.receiptUrl,
      },
    });
  }

  async findMyExpenses(userId: string, companyId: string) {
    return this.prisma.expense.findMany({
      where: {
        employeeId: userId,
        companyId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findCompanyExpenses(companyId: string) {
    return this.prisma.expense.findMany({
      where: {
        companyId,
      },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async approve(id: string, companyId: string) {
    const expense = await this.prisma.expense.findFirst({
      where: {
        id,
        companyId,
      },
    });

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    if (expense.status !== 'PENDING') {
      throw new BadRequestException('Expense is already processed');
    }

    return this.prisma.expense.update({
      where: { id },
      data: {
        status: 'APPROVED',
      },
    });
  }

  async reject(id: string, companyId: string) {
    const expense = await this.prisma.expense.findFirst({
      where: {
        id,
        companyId,
      },
    });

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    if (expense.status !== 'PENDING') {
      throw new BadRequestException('Expense is already processed');
    }

    return this.prisma.expense.update({
      where: { id },
      data: {
        status: 'REJECTED',
      },
    });
  }

  async getSummary(companyId: string) {
  const expenses = await this.prisma.expense.findMany({
    where: { companyId },
  });

  const totalAmount = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0,
  );

  const totalVat = expenses.reduce(
    (sum, expense) => sum + Number(expense.vatAmount),
    0,
  );

  return {
    totalExpenses: expenses.length,

    pending: expenses.filter((e) => e.status === 'PENDING').length,

    approved: expenses.filter((e) => e.status === 'APPROVED').length,

    rejected: expenses.filter((e) => e.status === 'REJECTED').length,

    totalAmount,

    totalVat,
  };
}
}