import { IsNotEmpty, IsNumber, IsEnum, IsString, Matches } from 'class-validator';
import { Payment } from '../../domain/entities/payment.entity';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{11}$/, { message: 'CPF must be 11 digits' })
  cpf: string;

  @IsString()
  description: string;

  @IsNumber()
  amount: number;

  @IsEnum(Payment)
  paymentMethod: Payment;
}
