## Payments API (NestJS + Prisma + Mercado Pago)

Este README descreve como configurar, rodar e testar a Payments API (PIX + Cartão de Crédito) que implementa o escopo do seu teste técnico.
Inclui: instalação, variáveis de ambiente, Docker (Postgres), migrações Prisma, seed (SQL e Prisma seed), endpoints (request/response), exemplos curl e arquivo rest.http para uso no VSCode.

## Requisitos

Node.js 18+

npm ou yarn

Docker & docker-compose (opcional, recomendado para Postgres)

Conta Mercado Pago (token de teste) para integrar cartão (opcional para testes locais)

## Variáveis de ambiente
Crie um arquivo .env na raiz do projeto (ou defina variáveis no seu ambiente):
```
# Banco
DATABASE_URL=postgresql://postgres:postgres@db:5432/payments

# App
PORT=3000
NODE_ENV=development

# Mercado Pago
MP_ACCESS_TOKEN=SEU_TOKEN_DE_TESTE_MP
MP_BASE_URL=https://api.mercadopago.com
MP_NOTIFICATION_URL=https://seu-dominio-ou-ngrok/api/payment/mercadopago/webhook
```
## Instalação rápida (local)
```
# clonar
git clone https://github.com/danubiobwm/payments-api

cd payments-api/api

# instalar dependências
npm ci

# gerar client prisma (ver seção Prisma)
npx prisma generate
```

## Rodando com Docker (Postgres)

Crie um docker-compose.yml (exemplo):

```
version: '3.8'
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: payments
    ports:
      - '5432:5432'
    volumes:
      - db-data:/var/lib/postgresql/data
volumes:
  db-data:

```

Inicie:
```
docker-compose up -d
```

Conecte o .env usando DATABASE_URL=postgresql://postgres:postgres@localhost:5432/payments se rodar local postgres (no mesmo host).

## Prisma: gerar client e migrar
Se você tem prisma/schema.prisma pronto, execute:
```
npx prisma generate
# criar migration dev (aplica localmente)
npx prisma migrate dev --name init
```
Se preferir apenas gerar client sem migrar:
```
npx prisma generate
```

## Populando dados de teste (seed)

Opção A — seed.sql (Postgres)

Salve o conteúdo abaixo como seed.sql e execute com psql (ou via pgAdmin).

Antes: habilite extensão de UUID (se necessário):
```
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- OU para pgcrypto:
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```
Conteúdo seed.sql (compatível com uuid_generate_v4()):
```
-- seed.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

TRUNCATE TABLE "Payment" RESTART IDENTITY CASCADE;

INSERT INTO "Payment" (id, cpf, description, amount, "paymentMethod", status, "externalId", "createdAt", "updatedAt")
VALUES
  (uuid_generate_v4(), '11122233396', 'Compra via PIX - Pendente', 150.50, 'PIX', 'PENDING', NULL, now(), now()),
  (uuid_generate_v4(), '22233344455', 'Compra via PIX - Pago', 300.00, 'PIX', 'PAID', NULL, now(), now()),
  (uuid_generate_v4(), '33344455566', 'Assinatura Cartão - Pendente', 99.90, 'CREDIT_CARD', 'PENDING', 'ext_123456', now(), now()),
  (uuid_generate_v4(), '44455566677', 'Assinatura Cartão - Pago', 199.00, 'CREDIT_CARD', 'PAID', 'ext_789012', now(), now()),
  (uuid_generate_v4(), '55566677788', 'Compra Cartão - Falhou', 49.99, 'CREDIT_CARD', 'FAIL', 'ext_345678', now(), now());
```
Rodar:
```
psql -U postgres -d payments -f seed.sql
```
Opção B — prisma/seed.ts (TypeScript) — usar com npx prisma db seed

Exemplo prisma/seed.ts:
```
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.payment.deleteMany();

  await prisma.payment.createMany({
    data: [
      { cpf: '11122233396', description: 'Compra via PIX - Pendente', amount: 150.5, paymentMethod: 'PIX', status: 'PENDING' },
      { cpf: '22233344455', description: 'Compra via PIX - Pago', amount: 300, paymentMethod: 'PIX', status: 'PAID' },
      { cpf: '33344455566', description: 'Assinatura Cartão - Pendente', amount: 99.9, paymentMethod: 'CREDIT_CARD', status: 'PENDING', externalId: 'ext_123456' },
      { cpf: '44455566677', description: 'Assinatura Cartão - Pago', amount: 199, paymentMethod: 'CREDIT_CARD', status: 'PAID', externalId: 'ext_789012' },
      { cpf: '55566677788', description: 'Compra Cartão - Falhou', amount: 49.99, paymentMethod: 'CREDIT_CARD', status: 'FAIL', externalId: 'ext_345678' },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```
Ajuste prisma config no package.json:
```
"prisma": {
  "seed": "ts-node prisma/seed.ts"
}
```
E rode:
```
npx prisma db seed

```

### Executando a aplicação

````
# instalar deps
npm ci

# gerar prisma client
npx prisma generate

# (opcional) aplicar migrações
npx prisma migrate dev --name init

# rodar em dev
npm run start:dev
# ou
npm run start
````

## Documentação dos endpoints
* Create PIX payment

 Request:
 ````
 POST /api/payment
Content-Type: application/json

 ````
 Body:
 ````
 {
  "cpf": "11122233396",
  "description": "Pagamento PIX teste",
  "amount": 150.50,
  "paymentMethod": "PIX"
}
`````

## Behavior / Business rule

se paymentMethod === "PIX": cria registro no DB com status = "PENDING". Não chama Mercado Pago.

Response (201 Created):
````
{
  "payment": {
    "id": "uuid-xxxx",
    "cpf": "11122233396",
    "description": "Pagamento PIX teste",
    "amount": 150.5,
    "paymentMethod": "PIX",
    "status": "PENDING",
    "externalId": null,
    "createdAt": "2025-09-25T12:00:00.000Z",
    "updatedAt": "2025-09-25T12:00:00.000Z"
  }
}
`````
Erros: 400 Bad Request (validação), 500 Server Error.

- Create CREDIT_CARD payment

Request:
````
POST /api/payment
Content-Type: application/json
````
Body:
````
{
  "cpf": "11122233396",
  "description": "Pagamento Cartao teste",
  "amount": 250.00,
  "paymentMethod": "CREDIT_CARD"
}
````

Behavior

cria registro no DB com status = "PENDING".

chama Mercado Pago /checkout/preferences para criar preference.

grava externalId (preference id) no DB.

retorna preference (id / init_point) para frontend usar.

Response (201 Created):

````
{
  "payment": {
    "id": "uuid-xxxx",
    "cpf": "11122233396",
    "description": "Pagamento Cartao teste",
    "amount": 250.0,
    "paymentMethod": "CREDIT_CARD",
    "status": "PENDING",
    "externalId": "123456789",
    "createdAt": "2025-09-25T12:00:00.000Z",
    "updatedAt": "2025-09-25T12:00:00.000Z"
  },
  "preference": {
    "id": "123456789",
    "init_point": "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=123456789",
    "...": "raw response"
  }
}
````
Observação: Não envie números de cartão (PAN) ao backend. Tokenize no frontend conforme Mercado Pago guide.

* Get payment by ID

  Request:
  ```
  GET /api/payment/{id}

  ```
  Response (200)
```
  {
    "id": "uuid-xxxx",
    "cpf": "11122233396",
    "description": "Pagamento PIX teste",
    "amount": 150.5,
    "paymentMethod": "PIX",
    "status": "PENDING",
    "externalId": null,
    "createdAt": "...",
    "updatedAt": "..."
  }
```
404 se não encontrado.

* List payments (filtros)

Request
```
GET /api/payment?cpf=11122233396&paymentMethod=PIX&status=PENDING
```

Response (200)
```
[
  {
    "id": "uuid-1",
    "cpf": "11122233396",
    "description": "...",
    "amount": 150.5,
    "paymentMethod": "PIX",
    "status": "PENDING"
  },
  { "...": "outro registro" }
]
```
Filtros opcionais: cpf, paymentMethod, status.

- Update Payment (status)

Request

```
PUT /api/payment/{id}
Content-Type: application/json

```

Body:
```
{
  "status": "PAID"
}
```
Response (200): retorna o pagamento atualizado.

Este endpoint pode ser usado internamente (admin) ou para atualizar manualmente; no fluxo real com cartão o status deve ser atualizado via webhook do Mercado Pago.

- Mercado Pago webhook (notificações)
Endpoint que deve ficar público
```
POST /api/payment/mercadopago/webhook
Content-Type: application/json
```
Exemplo body (padrão Mercado Pago varia):
```
{
  "data": {
    "id": "1234567890"
  },
  "type": "payment"
}
```
Behavior:

Recebe resource id (data.id ou query param).

Consulta Mercado Pago GET /v1/payments/{id} para obter informação completa.

Mapeia status Mercado Pago → nosso PaymentStatus:

approved → PAID

rejected / cancelled → FAIL

outros → PENDING

Atualiza pagamento no DB usando external_reference para localizar o nosso id.

Resposta: deve retornar 200 OK rapidamente (para evitar reenvios do MP).

Obs:
Arquivo rest.http na raiz do projeto, use a extensão REST Client (VSCode). para os testes dos endpoints.