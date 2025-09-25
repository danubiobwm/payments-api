import { Injectable, Inject } from '@nestjs/common';
import type  { IPaymentRepository } from '../domain/repositories/payment.repository.interface';
import { MercadopagoService } from '../infra/mercadopago/mercadopago.service';
import { PaymentMethod } from '../domain/enums/payment-method.enum';
import { PaymentStatus } from '../domain/enums/payment-status.enum';



interface CreatePaymentDto {
  cpf: string;
  description: string;
  amount: number;
  paymentMethod: PaymentMethod;
}

@Injectable()
export class CreatePaymentUseCase {
  constructor(
    @Inject('IPaymentRepository')
    private readonly paymentRepository: IPaymentRepository,
    private readonly mercadopagoService: MercadopagoService,
  ) {}

  async execute(dto: CreatePaymentDto) {
    const payment = await this.paymentRepository.create({
      cpf: dto.cpf,
      description: dto.description,
      amount: dto.amount,
      paymentMethod: dto.paymentMethod,
      status: PaymentStatus.PENDING,
    });

    if (dto.paymentMethod === PaymentMethod.CREDIT_CARD) {
      const preference = await this.mercadopagoService.createPreference(payment);
      await this.paymentRepository.setExternalId(payment.id, preference.id);
      return { payment, preference };
    }

    return { payment };
  }
}