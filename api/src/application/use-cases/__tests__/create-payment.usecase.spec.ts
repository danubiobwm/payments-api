import { PaymentMethod } from '../../../domain/enums/payment-method.enum';
import { PaymentStatus } from '../../../domain/enums/payment-status.enum';
import { CreatePaymentUseCase } from '../CreatePaymentUseCase';

describe('CreatePaymentUseCase (unit)', () => {
  let mockRepo: any;
  let mockMpService: any;
  let useCase: CreatePaymentUseCase;

  beforeEach(() => {
    mockRepo = {
      create: jest.fn(),
      setExternalId: jest.fn(),
    };
    mockMpService = {
      createPreference: jest.fn(),
    };
    useCase = new CreatePaymentUseCase(mockRepo, mockMpService);
  });

  it('should create a PIX payment and return the payment object', async () => {
    const mockPayment = {
      id: 'mock-id-1',
      cpf: '11122233396',
      description: 'Test PIX',
      amount: 150.50,
      paymentMethod: PaymentMethod.PIX,
      status: PaymentStatus.PENDING,
    };
    mockRepo.create.mockResolvedValue(mockPayment);

    const dto = {
      cpf: '11122233396',
      description: 'Test PIX',
      amount: 150.50,
      paymentMethod: PaymentMethod.PIX,
    };
    const result = await useCase.execute(dto);

    expect(mockRepo.create).toHaveBeenCalledWith(expect.objectContaining({
      cpf: dto.cpf,
      paymentMethod: PaymentMethod.PIX,
      status: PaymentStatus.PENDING,
    }));
    expect(mockMpService.createPreference).not.toHaveBeenCalled();
    expect(result.payment).toEqual(mockPayment);
    expect(result.preference).toBeUndefined();
  });

  it('should create a CREDIT_CARD payment and a Mercado Pago preference', async () => {
    const mockPayment = {
      id: 'mock-id-2',
      cpf: '11122233396',
      description: 'Test CC',
      amount: 250.00,
      paymentMethod: PaymentMethod.CREDIT_CARD,
      status: PaymentStatus.PENDING,
    };
    const mockPreference = { id: 'mp-pref-id-123', status: 'pending' };

    mockRepo.create.mockResolvedValue(mockPayment);
    mockMpService.createPreference.mockResolvedValue(mockPreference);

    const dto = {
      cpf: '11122233396',
      description: 'Test CC',
      amount: 250.00,
      paymentMethod: PaymentMethod.CREDIT_CARD,
    };
    const result = await useCase.execute(dto);

    expect(mockRepo.create).toHaveBeenCalledWith(expect.objectContaining({
      cpf: dto.cpf,
      paymentMethod: PaymentMethod.CREDIT_CARD,
      status: PaymentStatus.PENDING,
    }));
    expect(mockMpService.createPreference).toHaveBeenCalledWith(mockPayment);
    expect(mockRepo.setExternalId).toHaveBeenCalledWith(mockPayment.id, mockPreference.id);
    expect(result.payment).toEqual(mockPayment);
    expect(result.preference).toEqual(mockPreference);
  });
});