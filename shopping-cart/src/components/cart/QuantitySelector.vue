<template>
  <div
    class="inline-flex h-9 w-30 shrink-0 items-center overflow-hidden rounded-md bg-gray-100"
  >
    <button
      @click="selectedQuantity > minQuantity && selectedQuantity--"
      class="flex h-full w-9 shrink-0 cursor-pointer items-center justify-center bg-transparent text-lg font-normal leading-none text-gray-500 transition-colors hover:bg-gray-200/80 active:bg-gray-200"
    >
      -
    </button>
    <input
      type="number"
      v-model="selectedQuantity"
      :min="minQuantity"
      :max="maxQuantity"
      class="h-full min-h-0 min-w-0 flex-1 border-0 bg-gray-50/90 p-0 text-center text-base font-medium leading-none tabular-nums text-gray-700 focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      @input="$emit('update:quantity', sanitizeInput(selectedQuantity))"
    />
    <button
      @click="selectedQuantity < maxQuantity && selectedQuantity++"
      class="flex h-full w-9 shrink-0 cursor-pointer items-center justify-center bg-transparent text-lg font-normal leading-none text-gray-500 transition-colors hover:bg-gray-200/80 active:bg-gray-200"
    >
      +
    </button>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";

const props = withDefaults(
  defineProps<{
    quantity: number;
    minQuantity?: number;
    maxQuantity?: number;
  }>(),
  {
    minQuantity: 1,
    maxQuantity: 10,
    quantity: 1,
  },
);

const sanitizeInput = (value: number) => {
  if (value < props.minQuantity) {
    selectedQuantity.value = props.minQuantity;
  }
  if (value > props.maxQuantity) {
    selectedQuantity.value = props.maxQuantity;
  }
  return selectedQuantity.value;
};

const selectedQuantity = ref(props.quantity);

const emit = defineEmits<{
  (e: "update:quantity", quantity: number): void;
}>();

watch(selectedQuantity, () => {
  emit("update:quantity", selectedQuantity.value);
});
</script>
