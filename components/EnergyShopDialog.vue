<script setup lang="ts">
import { Ripple as vRipple } from '~/modules/sui/runtime/directives/ripple';
import { usePlayBilling } from '@/composables/usePlayBilling';

const dialog = defineModel<boolean>();

interface Tier {
  sku_id?: string;
  name: string;
  cost: number;
  yield: number;
  image: string;
}

const tiers = ref<Tier[]>([
  {
    sku_id: 'energy_basic',
    name: 'Basic',
    cost: 1.99,
    yield: 400,
    image: '/images/energy-basic.png',
  },
  {
    sku_id: 'energy_cosmic',
    name: 'Cosmic',
    cost: 3.99,
    yield: 900,
    image: '/images/energy-cosmic.png',
  },
  {
    sku_id: 'energy_divine',
    name: 'Divine',
    cost: 5.99,
    yield: 1400,
    image: '/images/energy-divine.png',
  },
]);

const successDialog = ref(false);
const purchasedTier = ref<Tier | null>(null);
function resolvePurchase(tier: Tier) {
  dialog.value = false;
  successDialog.value = true;
  purchasedTier.value = tier;
}

function closeSuccesDialog() {
  successDialog.value = false;
  setTimeout(() => {
    purchasedTier.value = null;
  }, 300);
}

const { isServiceAvailable, init, getSkus, skus, purchase } = usePlayBilling();

onMounted(async () => {
  await init();
  if (isServiceAvailable.value) {
    await getSkus();
  }
});

async function handlePurchase(tier: Tier) {
  const sku = skus.value.find((s) => s.itemId === tier.sku_id);
  console.log(
    `
    - finding sku for tier: ${tier.name}
    - sku_id: ${tier.sku_id}
    - skus: ${JSON.stringify(skus.value)}
    - found: ${JSON.stringify(sku)}`
  );
  if (sku) {
    const res = await purchase(sku.itemId);
    if (res) resolvePurchase(tier);
  } else {
    console.error('SKU not found for tier:', tier.name);
  }
}
</script>

<template>
  <alert-dialog
    v-model="successDialog"
    color="success"
    title="Energy Acquired"
    icon="fluent:checkmark-starburst-24-filled"
    primary-action-text="Continue"
    @click:primary-action="closeSuccesDialog"
  >
    <span class="text-green-200">+ {{ purchasedTier?.yield }} Energy</span>
  </alert-dialog>

  <v-overlay
    v-model="dialog"
    transition="dialog-transition"
    width="90%"
    max-width="600px"
    height="85%"
    close-on-back
    class="flex items-center justify-center"
  >
    <div class="arcana-card bg-arcana-gradient !p-6 h-full flex flex-col">
      <arcana-button
        class="absolute top-2 right-2 text-white"
        variant="text"
        icon
        @click="dialog = false"
      >
        <icon
          name="fluent:dismiss-20-filled"
          size="1.5rem"
        />
      </arcana-button>

      <h2 class="text-2xl font-bold text-white">Energy Shop</h2>
      <p class="text-white mt-2">
        Use your energy to purchase items from the shop.
      </p>

      <div class="space-y-4 mt-6 overflow-y-auto">
        <div
          v-for="tier in tiers"
          :key="tier.name"
          v-ripple
          class="arcana-glass text-center flex items-center justify-around p-6 w-full"
          @click="handlePurchase(tier)"
        >
          <div class="flex flex-col items-center">
            <div
              class="orb"
              :class="{
                'glow-basic': tier.name === 'Basic',
                'glow-cosmic': tier.name === 'Cosmic',
                'glow-divine': tier.name === 'Divine',
              }"
            >
              <nuxt-img
                class="w-12 shadow-blue-400 rounded-full orb"
                :src="tier.image"
                :alt="tier.name"
                placeholder
              />
            </div>
            <p class="mt-2 text-green-300 text-xs">+ {{ tier.yield }} Energy</p>
          </div>

          <div>
            <h6 class="text-white mt-2">{{ tier.name }}</h6>
            <h3 class="text-xl font-bold text-white mt-2">${{ tier.cost }}</h3>
          </div>

          <!-- todo: monthly subscription to save money 10% off -->
          <!-- todo: share app for free energy -->
        </div>
      </div>
    </div>
  </v-overlay>
</template>

<style scoped>
.orb {
  --glow-blur: 20px;
  --glow-animation-duration: 3s;
  --glow-opacity-1: 0.45;
  --glow-opacity-2: 0.85;

  position: relative;
}

.orb > i {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 2;
  animation: particlescontainer var(--particle-animation-duration) ease-in
    infinite both;
}

.orb::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80%;
  height: 80%;
  transform: translate(-50%, -50%);
  border-radius: 1000px;
  filter: blur(var(--glow-blur));
  animation: glow var(--glow-animation-duration) ease-in infinite both;
}

.glow-basic::after {
  background: radial-gradient(
    94.44% 94.44% at 49.54% 5.4%,
    rgba(0, 255, 255, 0.8) 0%,
    rgba(0, 150, 255, 0.62) 100%
  );
}

.glow-cosmic::after {
  background: radial-gradient(
    97.58% 87.19% at 51.31% 11.73%,
    rgba(255, 0, 255, 0.8) 0%,
    rgba(255, 0, 150, 0.62) 100%
  );
}

.glow-divine::after {
  background: radial-gradient(
    94.44% 94.44% at 49.54% 5.4%,
    rgba(253, 251, 69, 0.8) 0%,
    rgba(255, 150, 0, 0.62) 100%
  );
}

@keyframes glow {
  0%,
  100% {
    opacity: var(--glow-opacity-1);
  }
  50% {
    opacity: var(--glow-opacity-2);
  }
}
</style>
