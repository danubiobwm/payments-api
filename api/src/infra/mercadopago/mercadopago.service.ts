import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { Payment } from '../../domain/entities/payment.entity';

@Injectable()
export class MercadopagoService {
  private readonly logger = new Logger(MercadopagoService.name);
  private readonly baseUrl = process.env.MP_BASE_URL || 'https://api.mercadopago.com';
  private readonly token = process.env.MP_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN || '';

  private get headers() {
    return { Authorization: `Bearer ${this.token}`, 'Content-Type': 'application/json' };
  }

  async createPreference(payment: Payment) {
    try {
      const body = {
        items: [
          {
            id: payment.id,
            title: payment.description,
            quantity: 1,
            unit_price: Number(payment.amount),
            currency_id: 'BRL',
          },
        ],
        external_reference: payment.id,
        notification_url: process.env.MP_NOTIFICATION_URL || 'http://localhost:3000/api/payment/mercadopago/webhook',
      };

      const response = await axios.post(`${this.baseUrl}/checkout/preferences`, body, { headers: this.headers });
      return response.data; // contains id and init_point
    } catch (err: any) {
      this.logger.error('createPreference error', err?.response?.data || err.message || err);
      throw err;
    }
  }

  async getPayment(paymentId: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/v1/payments/${paymentId}`, { headers: this.headers });
      return response.data;
    } catch (err: any) {
      this.logger.error('getPayment error', err?.response?.data || err.message || err);
      throw err;
    }
  }
}
