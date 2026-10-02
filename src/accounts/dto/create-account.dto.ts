import {
  IsIn,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  @IsIn([
    'ASSET',
    'LIABILITY',
    'EQUITY',
    'REVENUE',
    'EXPENSE',
  ])
  type!: string;

  @IsOptional()
  @IsString()
  code?: string;
}