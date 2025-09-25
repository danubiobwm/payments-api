import { Body, Controller, Get, Param, Post, Put, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { CreatePaymentUseCase } from '../../application/use-cases/CreatePaymentUseCase';
import { UpdatePaymentStatusUseCase } from '../../application/use-cases/UpdatePaymentStatusUseCase';
import type { IPaymentRepository } from '../../domain/repositories/payment.repository.interface';
import { Inject } from '@nestjs/common';
import { CreatePaymentDto } from '../../application/dtos/create-payment.dto';
import { PaymentMethod } from '../../domain/enums/payment-method.enum';
import { PaymentStatus } from '../../domain/enums/payment-status.enum';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly createPaymentUseCase: CreatePaymentUseCase,
    private readonly updatePaymentStatusUseCase: UpdatePaymentStatusUseCase,
    @Inject('IPaymentRepository')
    private readonly paymentRepository: IPaymentRepository,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreatePaymentDto) {
    const result = await this.createPaymentUseCase.execute(dto as any);
    return result;
  }

  @Put(':id')
  async updateStatus(@Param('id') id: string, @Body() body: { status: PaymentStatus }) {
    const updated = await this.updatePaymentStatusUseCase.execute(id, body.status);
    return updated;
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const p = await this.paymentRepository.findById(id);
    return p;
  }

  @Get()
  async findAll(@Query('cpf') cpf?: string, @Query('paymentMethod') paymentMethod?: PaymentMethod, @Query('status') status?: PaymentStatus) {
    const list = await this.paymentRepository.findAll({ cpf, paymentMethod: paymentMethod as any, status: status as any });
    return list;
  }
}
