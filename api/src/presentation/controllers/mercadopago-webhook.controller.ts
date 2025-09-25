import { Body, Controller, Post } from '@nestjs/common';
import { MercadopagoService } from '../../infra/mercadopago/mercadopago.service';
import { PaymentRepositoryPrisma } from '../../infra/prisma/payment.repository.prisma';
import { PaymentStatus } from '../../domain/enums/payment-status.enum';

@Controller('payment/mercadopago')
export class MercadopagoWebhookController {
  constructor(
    private readonly mercadopagoService: MercadopagoService,
    private readonly paymentRepository: PaymentRepositoryPrisma,
  ) {}

  @Post('webhook')
  async handleWebhook(@Body() body: any) {
    const paymentId = body?.data?.id || body?.id;
    if (!paymentId) {
      return { message: 'Invalid payload' };
    }

    const paymentData = await this.mercadopagoService.getPayment(paymentId);

    const status =
      paymentData.status === 'approved'
        ? PaymentStatus.PAID
        : paymentData.status === 'rejected' || paymentData.status === 'cancelled'
        ? PaymentStatus.FAIL
        : PaymentStatus.PENDING;

    const updated = await this.paymentRepository.updateStatus(paymentData.external_reference, status);
    return { message: 'ok', updated };
  }
}
