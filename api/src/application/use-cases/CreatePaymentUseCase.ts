import { Injectable, Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import type { IPaymentRepository } from '../../domain/repositories/payment.repository.interface';
import { PaymentMethod } from '../../domain/enums/payment-method.enum';
import { PaymentStatus } from '../../domain/enums/payment-status.enum';
import { MercadopagoService } from '../../infra/mercadopago/mercadopago.service';
import { Payment } from '../../domain/entities/payment.entity';

@Injectable()
export class CreatePaymentUseCase {
  constructor(
    @Inject('IPaymentRepository')
    private readonly paymentRepository: IPaymentRepository,
    private readonly mercadopagoService: MercadopagoService,
  ) {}

  async execute(payload: {
    cpf: string;
    description: string;
    amount: number;
    paymentMethod: PaymentMethod;
  }): Promise<{ payment: Payment; preference?: any }> {
    const id = uuidv4();
    const toCreate = {
      id,
      cpf: payload.cpf,
      description: payload.description,
      amount: payload.amount,
      paymentMethod: payload.paymentMethod,
      status: PaymentStatus.PENDING,
      externalId: null,
    };

    const payment = await this.paymentRepository.create(toCreate);

    if (payload.paymentMethod === PaymentMethod.CREDIT_CARD) {
      const preference = await this.mercadopagoService.createPreference(payment);
      if (preference?.id) {
        await this.paymentRepository.setExternalId(payment.id, preference.id);
      }
      return { payment, preference };
    }

    return { payment };
  }
}
