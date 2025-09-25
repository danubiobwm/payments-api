import { Controller, Post, Body, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { MercadopagoService } from '../../infra/mercadopago/mercadopago.service';
import { Inject } from '@nestjs/common';
import type { IPaymentRepository } from '../../domain/repositories/payment.repository.interface';
import { PaymentStatus } from '../../domain/enums/payment-status.enum';

@Controller('payment/mercadopago')
export class MercadopagoWebhookController {
  private readonly logger = new Logger(MercadopagoWebhookController.name);

  constructor(
    private readonly mpService: MercadopagoService,
    @Inject('IPaymentRepository') private readonly paymentRepository: IPaymentRepository,
  ) {}

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async webhook(@Body() body: any) {
    this.logger.debug('MP webhook: ' + JSON.stringify(body));

    const resourceId = body?.data?.id || body?.id || body?.billing_id || (body?.collection?.id) || null;
    if (!resourceId) {
      this.logger.warn('Webhook without resource id');
      return { ok: true };
    }

    try {
      const mpPayment = await this.mpService.getPayment(String(resourceId));
      const statusLower = (mpPayment?.status || '').toLowerCase();
      const mapped =
        statusLower === 'approved' ? PaymentStatus.PAID : statusLower === 'rejected' || statusLower === 'cancelled' ? PaymentStatus.FAIL : PaymentStatus.PENDING;

      const externalRef = mpPayment?.external_reference || mpPayment?.order?.external_reference || mpPayment?.collector_id || null;
      if (externalRef) {
        await this.paymentRepository.updateStatus(externalRef, mapped);
      } else {
        this.logger.warn('MP payment without external_reference: ' + JSON.stringify(mpPayment));
      }

      return { ok: true };
    } catch (err) {
      this.logger.error('Webhook processing error', err);
      return { ok: true };
    }
  }
}
