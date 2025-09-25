import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { PaymentStatus } from '../domain/enums/payment-status.enum';

const prisma = new PrismaClient();

export async function registerPaymentActivity(payment: any) {
  return prisma.payment.create({
    data: {
      id: payment.id,
      cpf: payment.cpf,
      description: payment.description,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      status: 'PENDING',
    },
  });
}

export async function createPreferenceActivity(payment: any) {
  const token = process.env.MP_ACCESS_TOKEN || '';
  const baseUrl = process.env.MP_BASE_URL || 'https://api.mercadopago.com';

  const body = {
    items: [{ id: payment.id, title: payment.description, quantity: 1, unit_price: payment.amount }],
    external_reference: payment.id,
    notification_url: process.env.MP_NOTIFICATION_URL || '',
  };

  const res = await axios.post(`${baseUrl}/checkout/preferences`, body, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
}

export async function updatePaymentStatusActivity(payload: { id: string; status: string }) {
  return prisma.payment.update({
    where: { id: payload.id },
    data: { status: payload.status  as PaymentStatus}
  });
}
