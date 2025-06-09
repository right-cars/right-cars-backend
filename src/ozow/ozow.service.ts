import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { createHash } from 'node:crypto';

@Injectable()
export class OzowService {
  getSha512Hash(stringToHash: string) {
    const hash = createHash('sha512');
    hash.update(stringToHash);
    return hash.digest('hex');
  }

  generateRequestHashCheck(inputString: string) {
    const stringToHash = inputString.toLowerCase();
    return this.getSha512Hash(stringToHash);
  }

  generateRequestHash({
    countryCode,
    amount,
    siteCode,
    currencyCode,
    transactionReference,
    bankReference,
    cancelUrl,
    errorUrl,
    successUrl,
    notifyUrl,
    isTest,
  }) {
    const inputString = `${siteCode}${countryCode}${currencyCode}${amount}${transactionReference}${bankReference}${cancelUrl}${errorUrl}${successUrl}${notifyUrl}${isTest}${process.env.OZOW_PRIVATE_KEY}`;

    const calculatedHashResult = this.generateRequestHashCheck(inputString);
    return calculatedHashResult;
  }

  async initiatePayment(payloadData: any) {
    const { BACKEND_URL, OZOW_API_URL, OZOW_API_KEY, OZOW_SITE_CODE } =
      process.env;

      console.log({
        BACKEND_URL,
        OZOW_API_URL,
        OZOW_API_KEY,
        OZOW_SITE_CODE,
      });

    const payload = {
      countryCode: 'ZA',
      amount: payloadData.amount,
      transactionReference: 'Test1',
      bankReference: 'Ozow',
      cancelUrl: `${BACKEND_URL}/api/ozow/payment-cancelled`,
      currencyCode: 'ZAR',
      errorUrl: `${BACKEND_URL}/api/ozow/payment-failed`,
      isTest: true,
      notifyUrl: `${BACKEND_URL}/api/ozow/notify`,
      siteCode: OZOW_SITE_CODE,
      successUrl: `${BACKEND_URL}/api/ozow/success`,
    };

    const hashCheck = this.generateRequestHash(payload);
    try {
      const { data } = await axios.post(
        `${OZOW_API_URL}/PostPaymentRequest`,
        { ...payload, hashCheck },
        {
          headers: {
            ApiKey: OZOW_API_KEY,
          },
        },
      );

      return data;
    } catch {
        //@ts-expect-error
      console.log(error);
    }
  }

  async handleFailed(data: any) {
    // Логика при неудачном платеже
    console.log('❌ Платёж не прошёл:', data);
    return { status: 'failed', received: true };
  }

  async handleCancelled(data: any) {
    // Логика при отмене платежа
    console.log('⚠️ Платёж отменён пользователем:', data);
    return { status: 'cancelled', received: true };
  }

  async handleNotification(data: any) {
    // Логика обработки нотификации от Ozow (IPN)
    console.log('📩 Уведомление от Ozow:', data);

    // здесь можно обновить статус заказа
    return { status: 'notified', received: true };
  }

  async handleSuccess(data: any) {
    // Логика обработки нотификации от Ozow (IPN)
    console.log('📩 Уведомление от Ozow:', data);

    // здесь можно обновить статус заказа
    return { status: 'success', received: true };
  }
}
