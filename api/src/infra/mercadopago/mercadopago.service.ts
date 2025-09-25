import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { Payment } from '../../domain/entities/payment.entity';

@Injectable()
export class MercadopagoService {
  private readonly logger = new Logger(MercadopagoService.name);
  private readonly baseUrl = process.env.MP_BASE_URL || 'https://api.mercadopago.com';
  private readonly token = process.env.MP_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN;

  async createPreference(payment: Payment) {
    try {
      const body = {
        items: [
          {
            id: payment.id,
            title: payment.description,
            quantity: 1,
            unit_price: payment.amount,
          },
        ],
        external_reference: payment.id,
        notification_url: process.env.MP_NOTIFICATION_URL || 'http://localhost:3000/api/payment/mercadopago/webhook',
      };

      const res = await axios.post(`${this.baseUrl}/checkout/preferences`, body, {
        headers: { Authorization: `Bearer ${this.token}` },
      });

      return res.data;
    } catch (error) {
      this.logger.error('Error creating Mercado Pago preference', error);
      throw error;
    }
  }

  async getPayment(paymentId: string) {
    try {
      const res = await axios.get(`${this.baseUrl}/v1/payments/${paymentId}`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      return res.data;
    } catch (error) {
      this.logger.error('Error fetching Mercado Pago payment', error);
      throw error;
    }
  }
}
