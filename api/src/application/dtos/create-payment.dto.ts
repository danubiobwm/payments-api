import { IsEnum, IsNumber, IsPositive, IsString, Matches } from 'class-validator';
import { PaymentMethod } from '../../domain/enums/payment-method.enum';

export class CreatePaymentDto {
  @IsString()
  @Matches(/^\d{11}$/, { message: 'CPF must be 11 digits' })
  cpf: string;

  @IsString()
  description: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;
}
