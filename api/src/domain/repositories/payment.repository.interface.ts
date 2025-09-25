import { Payment } from '../entities/payment.entity';
import { PaymentMethod } from '../enums/payment-method.enum';
import { PaymentStatus } from '../enums/payment-status.enum';

export interface IPaymentRepository {
   create(data: {
    id?: string;
    cpf: string;
    description: string;
    amount: number;
    paymentMethod: PaymentMethod;
    status: PaymentStatus;
    externalId?: string | null;
  }): Promise<Payment>;

  update(id: string, data: Partial<Payment>): Promise<Payment>;
  findById(id: string): Promise<Payment | null>;
  findAll(filters?: { cpf?: string; paymentMethod?: PaymentMethod; status?: PaymentStatus }): Promise<Payment[]>;
  updateStatus(id: string, status: PaymentStatus): Promise<Payment>;
  setExternalId(id: string, externalId: string): Promise<Payment>;
}
