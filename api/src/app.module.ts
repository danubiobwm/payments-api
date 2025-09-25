import { Module } from '@nestjs/common';
import { PrismaService } from './infra/prisma/prisma.service';
import { PaymentRepositoryPrisma } from './infra/prisma/payment.repository.prisma';
import { MercadopagoService } from './infra/mercadopago/mercadopago.service';
import { PaymentController } from './presentation/controllers/payment.controller';
import { MercadopagoWebhookController } from './presentation/controllers/mercadopago-webhook.controller';
import { CreatePaymentUseCase } from './application/use-cases/CreatePaymentUseCase';
import { UpdatePaymentStatusUseCase } from './application/use-cases/UpdatePaymentStatusUseCase';

@Module({
  imports: [],
  controllers: [PaymentController, MercadopagoWebhookController],
  providers: [
    PrismaService,
    MercadopagoService,
    PaymentRepositoryPrisma,
    {
      provide: 'IPaymentRepository',
      useClass: PaymentRepositoryPrisma,
    },
    CreatePaymentUseCase,
    UpdatePaymentStatusUseCase,
  ],
})
export class AppModule {}
