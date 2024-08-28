interface PlayBillingServiceSku {
  itemId: string;
  purchaseType?: string;
  title?: string;
  description?: string;
}

interface PlayBillingService {
  lookups: PlayBillingServiceSku[];
  serviceURL: string;
  service: any | null;
  init: () => Promise<void>;
  getSkus: () => Promise<void>;
  purchase: (itemId: string) => Promise<boolean>;
  validatePurchase: (
    sku: PlayBillingServiceSku,
    purchaseToken: string
  ) => Promise<boolean>;
  consumePurchase: (purchaseToken: string) => Promise<void>;
}

export function usePlayBilling() {
  const isServiceAvailable: Ref<boolean> = ref(false);
  const skus: Ref<PlayBillingServiceSku[]> = ref([]);
  const { addBasicEnergy } = useEnergyStore();

  const playBillingService: PlayBillingService = {
    lookups: [
      { itemId: 'energy_basic', purchaseType: 'managed_by_android' },
      { itemId: 'energy_cosmic', purchaseType: 'managed_by_android' },
      { itemId: 'energy_divine', purchaseType: 'managed_by_android' },
    ],
    serviceURL: 'https://play.google.com/billing',
    service: null,

    async init() {
      if (!('getDigitalGoodsService' in window)) {
        console.error('Play Billing service is not available');
        this.service = null;
        return;
      }
      try {
        this.service = await window.getDigitalGoodsService(this.serviceURL);
        isServiceAvailable.value = this.service !== null;
      } catch (error) {
        this.service = null;
        isServiceAvailable.value = false;
        console.error('Play Billing service is not available', error);
      }
    },

    async getSkus() {
      if (!isServiceAvailable.value || !this.service) {
        throw new Error('Play Billing service is not available');
      }
      // ? for testing purposes only
      skus.value = this.lookups;
    },

    // async getSkus() {
    //   if (!isServiceAvailable.value || !this.service) {
    //     throw new Error('Play Billing service is not available');
    //   }
    //   const details = await this.service.getDetails(
    //     this.lookups.map((sku) => sku.itemId)
    //   );
    //   skus.value = details.map((detail: any) => ({
    //     ...detail,
    //     ...this.lookups.find((s) => s.itemId === detail.itemId),
    //   }));
    // },

    async purchase(itemId: string): Promise<boolean> {
      const sku = skus.value.find((s) => s.itemId === itemId);

      if (!sku) {
        throw new Error('SKU not found');
      }

      const paymentMethod: PaymentMethodData[] = [
        {
          supportedMethods: this.serviceURL,
          data: {
            sku: sku.itemId,
          },
        },
      ];

      const paymentDetails: PaymentDetailsInit = {
        total: {
          label: 'Total',
          // ? Even though the payment details are required, the Play Billing will ignore those values and use the values set when creating the SKU in the Play Console, so they can be filled with bogus values:
          amount: { currency: 'USD', value: '0.00' },
        },
      };

      const request = new PaymentRequest(paymentMethod, paymentDetails);
      const paymentResponse = await request.show();
      const { purchaseToken } = paymentResponse.details;

      const valid = await this.validatePurchase(sku, purchaseToken);

      await paymentResponse.complete(valid ? 'success' : 'fail');

      return valid;
    },

    async consumePurchase(purchaseToken: string): Promise<void> {
      if (!this.service) {
        throw new Error('Play Billing service is not available');
      }
      try {
        await this.service.consumeAsync(purchaseToken); // Call the API to consume the purchase
      } catch (error) {
        console.error('Error consuming purchase', error);
      }
    },

    async validatePurchase(
      sku: PlayBillingServiceSku,
      purchaseToken: string
    ): Promise<boolean> {
      const energyYield =
        sku.itemId === 'energy_basic'
          ? 600
          : sku.itemId === 'energy_cosmic'
            ? 1540
            : sku.itemId === 'energy_divine'
              ? 3120
              : 0;

      const addedEnergy = await addBasicEnergy(energyYield);
      if (addedEnergy) {
        // Consume the purchase to allow re-purchase
        await this.consumePurchase(purchaseToken);
      }
      return addedEnergy;
    },
  };

  return {
    isServiceAvailable,
    skus,
    init: playBillingService.init.bind(playBillingService),
    getSkus: playBillingService.getSkus.bind(playBillingService),
    purchase: playBillingService.purchase.bind(playBillingService),
  };
}
