import { Payment } from '../entities/payment.entity';
import { PaymentStatus } from '../enums/payment-status.enum';

export interface IPaymentRepository {
  create(data: Partial<Payment>): Promise<Payment>;
  update(id: string, data: Partial<Payment>): Promise<Payment>;
  findById(id: string): Promise<Payment | null>;
  findAll(filters?: { cpf?: string; paymentMethod?: string; status?: PaymentStatus }): Promise<Payment[]>;
  updateStatus(id: string, status: PaymentStatus): Promise<Payment>;
  setExternalId(id: string, externalId: string): Promise<Payment>;
}
