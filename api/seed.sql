-- Limpa a tabela antes
TRUNCATE TABLE "Payment" RESTART IDENTITY CASCADE;

-- 1) PIX pendente
INSERT INTO "Payment" (id, cpf, description, amount, "paymentMethod", status, "externalId", "createdAt", "updatedAt")
VALUES
  (gen_random_uuid(), '11122233396', 'Compra via PIX - Pendente', 150.50, 'PIX', 'PENDING', NULL, now(), now());

-- 2) PIX já pago
INSERT INTO "Payment" (id, cpf, description, amount, "paymentMethod", status, "externalId", "createdAt", "updatedAt")
VALUES
  (gen_random_uuid(), '22233344455', 'Compra via PIX - Pago', 300.00, 'PIX', 'PAID', NULL, now(), now());

-- 3) Cartão de crédito pendente
INSERT INTO "Payment" (id, cpf, description, amount, "paymentMethod", status, "externalId", "createdAt", "updatedAt")
VALUES
  (gen_random_uuid(), '33344455566', 'Assinatura Cartão - Pendente', 99.90, 'CREDIT_CARD', 'PENDING', 'ext_123456', now(), now());

-- 4) Cartão de crédito aprovado
INSERT INTO "Payment" (id, cpf, description, amount, "paymentMethod", status, "externalId", "createdAt", "updatedAt")
VALUES
  (gen_random_uuid(), '44455566677', 'Assinatura Cartão - Pago', 199.00, 'CREDIT_CARD', 'PAID', 'ext_789012', now(), now());

-- 5) Cartão de crédito recusado
INSERT INTO "Payment" (id, cpf, description, amount, "paymentMethod", status, "externalId", "createdAt", "updatedAt")
VALUES
  (gen_random_uuid(), '55566677788', 'Compra Cartão - Falhou', 49.99, 'CREDIT_CARD', 'FAIL', 'ext_345678', now(), now());