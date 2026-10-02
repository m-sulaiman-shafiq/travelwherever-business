import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';

@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountsController {
  constructor(
    private readonly accountsService: AccountsService,
  ) {}

  @Get()
  findCompanyAccounts(@Req() req: any) {
    return this.accountsService.findCompanyAccounts(
      req.user.companyId,
    );
  }

  @Post()
  create(
    @Req() req: any,
    @Body() dto: CreateAccountDto,
  ) {
    return this.accountsService.create(
      req.user.companyId,
      dto,
    );
  }
}