import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { IPaymentRepository } from '../../domain/repositories/payment.repository.interface';
import { Payment } from '../../domain/entities/payment.entity';
import { PaymentMethod } from '../../domain/enums/payment-method.enum';
import { PaymentStatus } from '../../domain/enums/payment-status.enum';

@Injectable()
export class PaymentRepositoryPrisma implements IPaymentRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToEntity(row: any): Payment {
    return {
      id: row.id,
      cpf: row.cpf,
      description: row.description,
      amount: Number(row.amount),
      paymentMethod: row.paymentMethod as PaymentMethod,
      status: row.status as PaymentStatus,
      externalId: row.externalId ?? null,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  async create(data: {
    id?: string;
    cpf: string;
    description: string;
    amount: number;
    paymentMethod: PaymentMethod;
    status: PaymentStatus;
    externalId?: string | null;
  }): Promise<Payment> {
    // prisma expects required fields; explicitly pass them
    const created = await this.prisma.payment.create({
      data: {
        id: data.id,
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
    const updated = await this.prisma.payment.update({
      where: { id },
      data: {
        cpf: data.cpf ?? undefined,
        description: data.description ?? undefined,
        amount: data.amount ?? undefined,
        paymentMethod: data.paymentMethod ?? undefined,
        status: data.status ?? undefined,
        externalId: data.externalId ?? undefined,
      },
    });
    return this.mapToEntity(updated);
  }

  async findById(id: string): Promise<Payment | null> {
    const row = await this.prisma.payment.findUnique({ where: { id } });
    return row ? this.mapToEntity(row) : null;
  }

  async findAll(filters?: { cpf?: string; paymentMethod?: PaymentMethod; status?: PaymentStatus }): Promise<Payment[]> {
    const where: any = {};
    if (filters?.cpf) where.cpf = filters.cpf;
    if (filters?.paymentMethod) where.paymentMethod = filters.paymentMethod;
    if (filters?.status) where.status = filters.status;

    const rows = await this.prisma.payment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((r) => this.mapToEntity(r));
  }

  async updateStatus(id: string, status: PaymentStatus): Promise<Payment> {
    const updated = await this.prisma.payment.update({ where: { id }, data: { status } });
    return this.mapToEntity(updated);
  }

  async setExternalId(id: string, externalId: string): Promise<Payment> {
    const updated = await this.prisma.payment.update({ where: { id }, data: { externalId } });
    return this.mapToEntity(updated);
  }
}
