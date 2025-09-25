import { PaymentMethod } from '../../../domain/enums/payment-method.enum';
import { updatePaymentStatusActivity } from '../../../temporal/activities';
import { CreatePaymentUseCase } from '../CreatePaymentUseCase';


describe('CreatePaymentUseCase (unit)', () => {
  it('should create a PIX payment', async () => {
    const mockRepo: any = {
      create: jest.fn().mockResolvedValue({
        id: 'id-1',
        cpf: '11122233396',
        description: 'desc',
        amount: 10,
        paymentMethod: PaymentMethod.PIX,
        status: updatePaymentStatusActivity.PENDING,
      }),
    };
    const mockMp: any = {};
    const uc = new CreatePaymentUseCase(mockRepo, mockMp);
    const res = await uc.execute({ cpf: '11122233396', description: 'desc', amount: 10, paymentMethod: PaymentMethod.PIX });
    expect(res.payment).toBeDefined();
    expect(res.payment.status).toBe(PaymentStatus.PENDING);
  });
});
