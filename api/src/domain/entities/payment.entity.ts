import { PaymentMethod } from '../enums/payment-method.enum';
import { PaymentStatus } from '../enums/payment-status.enum';

export class Payment {
  id: string;
  cpf: string;
  description: string;
  amount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  externalId?: string;
  createdAt: Date;
  updatedAt: Date;
}
