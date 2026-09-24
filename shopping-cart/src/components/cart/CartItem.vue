<template>
  <p>cart item</p>
</template>
<script setup lang="ts">
import type { CartItem } from "@/types";

const props = defineProps<{
  item: CartItem;
}>();
</script>
