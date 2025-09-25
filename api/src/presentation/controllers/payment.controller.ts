import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreatePaymentUseCase } from '../../application/use-cases/CreatePaymentUseCase';
import { UpdatePaymentStatusUseCase } from '../../application/use-cases/UpdatePaymentStatusUseCase';
import { PaymentStatus } from '../../domain/enums/payment-status.enum';
import { PaymentMethod } from '../../domain/enums/payment-method.enum';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly createPaymentUseCase: CreatePaymentUseCase,
    private readonly updatePaymentStatusUseCase: UpdatePaymentStatusUseCase,
  ) {}

  @Post()
  async create(@Body() body: { cpf: string; description: string; amount: number; paymentMethod: PaymentMethod }) {
    return this.createPaymentUseCase.execute(body);
  }

  @Put(':id')
  async updateStatus(@Param('id') id: string, @Body() body: { status: PaymentStatus }) {
    return this.updatePaymentStatusUseCase.execute(id, body.status);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.updatePaymentStatusUseCase['paymentRepository'].findById(id);
  }

  @Get()
  async findAll(
    @Query('cpf') cpf?: string,
    @Query('paymentMethod') paymentMethod?: PaymentMethod,
    @Query('status') status?: PaymentStatus,
  ) {
    return this.updatePaymentStatusUseCase['paymentRepository'].findAll({ cpf, paymentMethod, status });
  }
}
