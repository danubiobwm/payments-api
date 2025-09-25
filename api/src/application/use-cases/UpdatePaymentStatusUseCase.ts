import { Injectable, Inject } from '@nestjs/common';
import type { IPaymentRepository } from '../../domain/repositories/payment.repository.interface';
import { PaymentStatus } from '../../domain/enums/payment-status.enum';
import { Payment } from '../../domain/entities/payment.entity';

@Injectable()
export class UpdatePaymentStatusUseCase {
  constructor(
    @Inject('IPaymentRepository')
    private readonly paymentRepository: IPaymentRepository,
  ) {}

  async execute(id: string, status: PaymentStatus): Promise<Payment> {
    return this.paymentRepository.updateStatus(id, status);
  }
}
