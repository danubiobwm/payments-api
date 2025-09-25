import { Module } from '@nestjs/common';
import { CreatePaymentUseCase } from './application/use-cases/CreatePaymentUseCase';
import { UpdatePaymentStatusUseCase } from './application/use-cases/UpdatePaymentStatusUseCase';

import { PrismaService } from './infra/prisma/prisma.service';
import { MercadopagoService } from './infra/mercadopago/mercadopago.service';
import { PaymentController } from './presentation/controllers/payment.controller';
import { MercadopagoWebhookController } from './presentation/controllers/mercadopago-webhook.controller';
import { PaymentRepositoryPrisma } from './infra/prisma/payment.repository.prisma';

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
