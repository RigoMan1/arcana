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
        this.service = null;
        return;
      }
      try {
        this.service = await window.getDigitalGoodsService(this.serviceURL);
        isServiceAvailable.value = this.service !== null;
      } catch (error) {
        this.service = null;
        isServiceAvailable.value = false;
      }
    },

    async getSkus() {
      if (!isServiceAvailable.value || !this.service) {
        throw new Error('Play Billing service is not available');
      }
      const details = await this.service.getDetails(
        this.lookups.map((sku) => sku.itemId)
      );
      skus.value = details.map((detail: any) => ({
        ...detail,
        ...this.lookups.find((s) => s.itemId === detail.itemId),
      }));
    },

    async purchase(itemId: string): Promise<boolean> {
      const sku = skus.value.find((s) => s.itemId === itemId);

      console.log('skus 🏷️', skus.value);

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

      // ? Even though the payment details are required, the Play Billing will ignore those values and use the values set when creating the SKU in the Play Console, so they can be filled with bogus values:
      const paymentDetails: PaymentDetailsInit = {
        total: {
          label: 'Total',
          amount: { currency: 'USD', value: '0.00' },
        },
      };

      const request = new PaymentRequest(paymentMethod, paymentDetails);
      const response = await request.show();
      const { purchaseToken } = response.details;

      const valid = await this.validatePurchase(sku, purchaseToken);

      await response.complete(valid ? 'success' : 'fail');

      return valid;
    },

    async validatePurchase(sku: PlayBillingServiceSku): Promise<boolean> {
      const energyYield =
        sku.itemId === 'energy_basic'
          ? 400
          : sku.itemId === 'energy_cosmic'
            ? 900
            : sku.itemId === 'energy_divine'
              ? 1400
              : 0;

      return await addBasicEnergy(energyYield);
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
