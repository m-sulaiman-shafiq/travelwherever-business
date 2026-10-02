import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Get()
  findCompanyUsers(@Req() req: any) {
    return this.usersService.findCompanyUsers(
      req.user.companyId,
    );
  }

  @Post()
  createEmployee(
    @Req() req: any,
    @Body() dto: CreateUserDto,
  ) {
    return this.usersService.createEmployee(
      req.user.companyId,
      dto,
    );
  }
}