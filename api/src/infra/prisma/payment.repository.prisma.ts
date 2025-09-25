import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { IPaymentRepository } from '../../domain/repositories/payment.repository.interface';
import { PaymentStatus } from '../../domain/enums/payment-status.enum';
import { Payment } from '../../domain/entities/payment.entity';

@Injectable()
export class PaymentRepositoryPrisma implements IPaymentRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: Omit<Payment, 'id'>): Promise<Payment> {
    const created = await this.prisma.payment.create({
      data: {
        cpf: data.cpf,
        description: data.description,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        status: data.status,
        externalId: data.externalId ?? null,
      },
    });
    return this.mapToEntity(created);
  }

  async update(id: string, data: Partial<Payment>): Promise<Payment> {
    const updated = await this.prisma.payment.update({ where: { id }, data });
    return this.mapToEntity(updated);
  }

  async findById(id: string): Promise<Payment | null> {
    const payment = await this.prisma.payment.findUnique({ where: { id } });
    return payment ? this.mapToEntity(payment) : null;
  }

 async findAll(filters?: Partial<Payment>): Promise<Payment[]> {
  const payments = await this.prisma.payment.findMany({
    where: {
      cpf: filters?.cpf,
      paymentMethod: filters?.paymentMethod as any,
      status: filters?.status as any,
    },
  });
  return payments.map((payment) => this.mapToEntity(payment));
}

  async updateStatus(id: string, status: PaymentStatus): Promise<Payment> {
    const updated = await this.prisma.payment.update({ where: { id }, data: { status } });
    return this.mapToEntity(updated);
  }

  async setExternalId(id: string, externalId: string): Promise<Payment> {
    const updated = await this.prisma.payment.update({ where: { id }, data: { externalId } });
    return this.mapToEntity(updated);
  }

  private mapToEntity(payment: any): Payment {
    return {
      ...payment,
      amount: Number(payment.amount),
    };
  }
}
