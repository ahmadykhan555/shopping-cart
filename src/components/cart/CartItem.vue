<template>
  <article
    class="max-xl:relative w-full min-w-0 border-b border-gray-100 py-6 md:col-span-full xl:grid xl:grid-cols-subgrid xl:items-center"
  >
    <div class="flex min-w-0 items-center gap-4">
      <div
        class="relative shrink-0 h-20 w-20 ring-1 ring-gray-200/80 rounded-lg"
      >
        <img
          v-if="item.images?.length"
          :src="item.images[0]"
          :alt="item.title"
          loading="lazy"
          class="size-full object-cover"
        />
        <button
          type="button"
          class="absolute -right-2 -top-2 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-gray-100/90 text-gray-600 shadow-sm ring-1 ring-gray-200/80 backdrop-blur-sm transition-colors hover:bg-red-600 hover:text-white hover:ring-red-600/80 focus-visible:outline focus-visible:outline-offset-1 focus-visible:outline-red-500"
          :aria-label="`Remove ${item.title} from cart`"
          @click="emit('click:removeItem', item.id)"
        >
          <XIcon class="size-2.5 stroke-[2.5]" />
        </button>
      </div>
      <div>
        <h3 class="min-w-0 text-base font-medium leading-snug text-gray-900">
          {{ item.title }}
        </h3>
        <p class="mt-1 text-sm text-gray-500 line-clamp-2">
          {{ item.description }}
        </p>
      </div>
    </div>
    <p
      class="text-sm xl:text-base font-medium max-xl:mt-2 max-xl:mb-7 tabular-nums text-gray-900"
    >
      {{ formatMoney(item.price) }}
      <span class="max-xl:inline hidden text-xs text-gray-500">/ item</span>
    </p>
    <QuantitySelector
      class="justify-self-start self-center"
      :quantity="item.quantity"
      @update:quantity="emit('updateItemQuantity', item.id, $event)"
    />
    <p
      class="text-right text-base font-medium tabular-nums text-gray-900 max-xl:absolute max-xl:right-0 max-xl:bottom-7"
    >
      {{ formatMoney(item.price * item.quantity) }}
    </p>
  </article>
</template>
<script setup lang="ts">
import type { CartItem } from "@/types";
import { formatMoney } from "@/utils";
import XIcon from "@/assets/icons/XIcon.vue";
import QuantitySelector from "./QuantitySelector.vue";

defineProps<{
  item: Readonly<CartItem>;
}>();

const emit = defineEmits<{
  "click:removeItem": [id: number];
  updateItemQuantity: [id: number, quantity: number];
}>();
</script>
