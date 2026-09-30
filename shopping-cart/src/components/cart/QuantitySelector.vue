<template>
  <div
    class="inline-flex h-9 w-30 shrink-0 items-center overflow-hidden rounded-md bg-gray-100"
  >
    <button
      data-testid="decrement-quantity-button"
      @click="handleUpdateQuantityOnClick('decrement')"
      class="flex h-full w-9 shrink-0 cursor-pointer items-center justify-center bg-transparent text-lg font-normal leading-none text-gray-500 transition-colors hover:bg-gray-200/80 active:bg-gray-200"
    >
      -
    </button>
    <input
      type="number"
      v-model.number="selectedQuantity"
      :min="minQuantity"
      :max="maxQuantity"
      class="h-full min-h-0 min-w-0 flex-1 border-0 bg-gray-50/90 p-0 text-center text-base font-medium leading-none tabular-nums text-gray-700 focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      @blur="handleUpdateQuantityByUserInput"
      @keydown.enter="handleUpdateQuantityByUserInput"
    />
    <button
      data-testid="increment-quantity-button"
      @click="handleUpdateQuantityOnClick('increment')"
      class="flex h-full w-9 shrink-0 cursor-pointer items-center justify-center bg-transparent text-lg font-normal leading-none text-gray-500 transition-colors hover:bg-gray-200/80 active:bg-gray-200"
    >
      +
    </button>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { MIN_QUANTITY, MAX_QUANTITY } from "@/consts";

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

const sanitizeInput = (value: number) => {
  if (value < props.minQuantity) {
    return props.minQuantity;
  }
  if (value > props.maxQuantity) {
    return props.maxQuantity;
  }
  return Math.floor(value);
};

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
</script>
