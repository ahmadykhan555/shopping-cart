<template>
  <div class="flex items-center gap-2 rounded-md w-24">
    <button
      @click="selectedQuantity > 1 && selectedQuantity--"
      class="flex-1 border border-gray-300 p-2"
    >
      -
    </button>
    <input
      type="number"
      v-model="selectedQuantity"
      min="1"
      class="w-10 text-center"
      @input="$emit('update:quantity', selectedQuantity)"
    />
    <button
      @click="selectedQuantity++"
      class="flex-1 border border-gray-300 p-2"
    >
      +
    </button>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  quantity: number;
}>();

const selectedQuantity = ref(props.quantity);

defineEmits<{
  (e: "update:quantity", quantity: number): void;
}>();
</script>
