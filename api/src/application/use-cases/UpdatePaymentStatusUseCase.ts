import { Injectable, Inject } from '@nestjs/common';
import type { IPaymentRepository } from '../../domain/repositories/payment.repository.interface';
import { PaymentStatus } from '../../domain/enums/payment-status.enum';

@Injectable()
export class UpdatePaymentStatusUseCase {
  constructor(
    @Inject('IPaymentRepository')
    private readonly paymentRepository: IPaymentRepository,
  ) {}

  async execute(id: string, status: PaymentStatus) {
    return this.paymentRepository.updateStatus(id, status);
  }
}
