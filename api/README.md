## Added artifacts
- `curl-examples.sh` – exemplos de chamadas curl para testar PIX, CREDIT_CARD, webhook e consultas.
- `test/payment.e2e-spec.ts` – testes e2e com supertest.
- `src/application/use-cases/__tests__/create-payment.usecase.spec.ts` – teste unitário.
- `src/temporal/workflows.ts` e `src/temporal/activities.ts` – esqueleto Temporal.

### Como rodar testes
1. Configure `DATABASE_URL` para um banco de teste.
2. `npm install`
3. `npx prisma generate && npx prisma migrate dev`
4. `npm run test:unit`
5. `npm run test:e2e`

### Temporal
- Necessita servidor Temporal rodando (`docker-compose` ou Temporal Cloud).
- Rodar worker com `@temporalio/worker` registrando `activities.ts`.
- Workflow principal: `paymentWorkflow`.
