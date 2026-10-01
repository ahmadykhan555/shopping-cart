<template>
  <div
    class="inline-flex h-9 w-30 shrink-0 items-center overflow-hidden rounded-md bg-gray-100"
  >
    <AppButton
      type="button"
      variant="ghost"
      data-testid="decrement-quantity-button"
      aria-label="Decrease quantity"
      class="flex h-full w-9 shrink-0 items-center justify-center text-lg font-normal leading-none text-gray-500 transition-colors hover:bg-gray-200/80 active:bg-gray-200"
      :disabled="quantity === minQuantity"
      @click="handleUpdateQuantityOnClick('decrement')"
    >
      -
    </AppButton>
    <input
      type="number"
      v-model.number="selectedQuantity"
      :min="minQuantity"
      :max="maxQuantity"
      class="h-full min-h-0 min-w-0 flex-1 border-0 bg-gray-50/90 p-0 text-center text-base font-medium leading-none tabular-nums text-gray-700 focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      @blur="handleUpdateQuantityByUserInput"
      @keydown.enter="handleUpdateQuantityByUserInput"
    />
    <AppButton
      type="button"
      variant="ghost"
      data-testid="increment-quantity-button"
      aria-label="Increase quantity"
      class="flex h-full w-9 shrink-0 items-center justify-center text-lg font-normal leading-none text-gray-500 transition-colors hover:bg-gray-200/80 active:bg-gray-200"
      :disabled="quantity === maxQuantity"
      @click="handleUpdateQuantityOnClick('increment')"
    >
      +
    </AppButton>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
import { MIN_QUANTITY, MAX_QUANTITY } from "@/consts";
import { clampCartQuantity } from "@/utils";
import AppButton from "../base/AppButton.vue";

const props = withDefaults(
  defineProps<{
    quantity: number;
    minQuantity?: number;
    maxQuantity?: number;
  }>(),
  {
    quantity: 1,
    minQuantity: MIN_QUANTITY,
    maxQuantity: MAX_QUANTITY,
  },
);

const emit = defineEmits<{
  (e: "update:quantity", quantity: number): void;
}>();

const sanitizeInput = (value: number) =>
  clampCartQuantity(value, props.minQuantity, props.maxQuantity);

const selectedQuantity = ref(sanitizeInput(props.quantity));

const handleUpdateQuantityOnClick = (operation: "increment" | "decrement") => {
  const newQuantity =
    operation === "increment"
      ? selectedQuantity.value + 1
      : selectedQuantity.value - 1;
  selectedQuantity.value = sanitizeInput(newQuantity);
  emit("update:quantity", selectedQuantity.value);
};

const handleUpdateQuantityByUserInput = () => {
  selectedQuantity.value = sanitizeInput(selectedQuantity.value);
  emit("update:quantity", selectedQuantity.value);
};

watch(
  () => props.quantity,
  (newValue) => {
    if (newValue !== selectedQuantity.value) {
      selectedQuantity.value = sanitizeInput(newValue);
    }
  },
);
</script>
