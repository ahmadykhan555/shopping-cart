<template>
  <article
    class="w-full min-w-0 border-b border-gray-100 py-6 md:col-span-full md:grid md:grid-cols-subgrid md:items-center"
  >
    <div class="flex min-w-0 items-center gap-4">
      <div class="relative shrink-0 pt-1.5 pr-1.5">
        <img
          :src="item.image"
          :alt="item.title"
          class="h-20 w-20 rounded-lg object-cover ring-1 ring-gray-200/80"
        />
        <button
          type="button"
          class="absolute right-0 top-0 z-10 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-gray-100/90 text-gray-600 shadow-sm ring-1 ring-gray-200/80 backdrop-blur-sm transition-colors hover:bg-red-600 hover:text-white hover:ring-red-600/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-red-500"
          :aria-label="`Remove ${item.title} from cart`"
          @click="emit('remove', item.id)"
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
    <p class="text-base font-medium tabular-nums text-gray-900">
      {{ formatMoney(item.price) }}
    </p>
    <QuantitySelector
      class="justify-self-start self-center"
      :quantity="item.quantity"
      @update:quantity="updateItemQuantity(item.id, $event)"
    />
    <p class="text-right text-base font-medium tabular-nums text-gray-900">
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
  item: CartItem;
  updateItemQuantity: (id: number, quantity: number) => void;
}>();

const emit = defineEmits<{
  remove: [id: number];
}>();
</script>
