# 1) Create PIX payment
curl -s -X POST http://localhost:3000/api/payment \
  -H "Content-Type: application/json" \
  -d '{"cpf":"11122233396","description":"Pagamento PIX teste","amount":150.50,"paymentMethod":"PIX"}'

# 2) Create CREDIT_CARD payment
curl -s -X POST http://localhost:3000/api/payment \
  -H "Content-Type: application/json" \
  -d '{"cpf":"11122233396","description":"Pagamento Cartao teste","amount":250.00,"paymentMethod":"CREDIT_CARD"}'

# 3) Get payment by id
curl -s http://localhost:3000/api/payment/<PAYMENT_ID>

# 4) List payments by CPF
curl -s 'http://localhost:3000/api/payment?cpf=11122233396'

# 5) Update payment status
curl -s -X PUT http://localhost:3000/api/payment/<PAYMENT_ID> \
  -H "Content-Type: application/json" \
  -d '{"status":"PAID"}'

# 6) Simulate Mercado Pago webhook
curl -s -X POST http://localhost:3000/api/payment/mercadopago/webhook \
  -H "Content-Type: application/json" \
  -d '{"data": {"id": "PAYMENT_ID_FROM_MP"}}'
