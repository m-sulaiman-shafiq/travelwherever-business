import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateExpenseDto {
  @IsString()
  category!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0.01)
  amount!: number;

  @IsNumber()
  @Min(0)
  vatAmount!: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsDateString()
  expenseDate!: string;

  @IsOptional()
  @IsString()
  receiptUrl?: string;
}