import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';

@Controller('expenses')
@UseGuards(JwtAuthGuard)
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  create(@Req() req: any, @Body() dto: CreateExpenseDto) {
    return this.expensesService.create(
      req.user.userId,
      req.user.companyId,
      dto,
    );
  }

  @Get('my')
  findMyExpenses(@Req() req: any) {
    return this.expensesService.findMyExpenses(
      req.user.userId,
      req.user.companyId,
    );
  }

  @Get()
  findCompanyExpenses(@Req() req: any) {
    return this.expensesService.findCompanyExpenses(req.user.companyId);
  }

  @Get('summary')
  getSummary(@Req() req: any) {
    return this.expensesService.getSummary(req.user.companyId);
  }

  @Patch(':id/approve')
  approve(@Req() req: any, @Param('id') id: string) {
    return this.expensesService.approve(id, req.user.companyId);
  }

  @Patch(':id/reject')
  reject(@Req() req: any, @Param('id') id: string) {
    return this.expensesService.reject(id, req.user.companyId);
  }
}
