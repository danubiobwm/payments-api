import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/infra/prisma/prisma.service';

describe('Payments API (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/payment (POST) create PIX', async () => {
    const payload = {
      cpf: '11122233396',
      description: 'E2E Test PIX',
      amount: 10.5,
      paymentMethod: 'PIX',
    };
    const res = await request(app.getHttpServer()).post('/api/payment').send(payload);
    expect(res.status).toBe(201);
    expect(res.body.payment).toHaveProperty('id');
    expect(res.body.payment.status).toBe('PENDING');
  });

  it('/api/payment (POST) create CREDIT_CARD', async () => {
    const payload = {
      cpf: '11122233396',
      description: 'E2E Test CARD',
      amount: 20.0,
      paymentMethod: 'CREDIT_CARD',
    };
    const res = await request(app.getHttpServer()).post('/api/payment').send(payload);
    expect(res.status).toBe(201);
    expect(res.body.payment).toHaveProperty('id');
  });
});
