import { proxyActivities, defineSignal, setHandler } from '@temporalio/workflow';
import type * as activities from './activities';

const { registerPaymentActivity, createPreferenceActivity, updatePaymentStatusActivity } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});

export const notifySignal = defineSignal<[any]>('notify');

export async function paymentWorkflow(input: { id: string; cpf: string; description: string; amount: number; paymentMethod: string }) {
  await registerPaymentActivity(input);

  if (input.paymentMethod === 'CREDIT_CARD') {
    const pref = await createPreferenceActivity(input);

    let result: any = null;
    setHandler(notifySignal, (payload: any) => {
      result = payload;
    });

    while (result === null) {
      await new Promise((r) => setTimeout(r, 1000));
    }

    await updatePaymentStatusActivity({ id: input.id, status: result.status });
    return result;
  }

  return { status: 'PENDING' };
}
