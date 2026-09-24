<template>
  <p>cart summary</p>
</template>

<script setup lang="ts">
import type { CartSummary } from "@/types";

const props = defineProps<{
  summary: CartSummary;
}>();
</script>
