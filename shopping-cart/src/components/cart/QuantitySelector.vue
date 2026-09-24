<template>
  <div class="flex items-center gap-2 rounded-md w-24">
    <button
      @click="selectedQuantity > minQuantity && selectedQuantity--"
      class="flex-1 border border-gray-300 p-2"
    >
      -
    </button>
    <input
      type="number"
      v-model="selectedQuantity"
      :min="minQuantity"
      :max="maxQuantity"
      class="w-10 text-center"
      @input="$emit('update:quantity', sanitizeInput(selectedQuantity))"
    />
    <button
      @click="selectedQuantity < maxQuantity && selectedQuantity++"
      class="flex-1 border border-gray-300 p-2"
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
