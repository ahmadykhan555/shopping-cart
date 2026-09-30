<template>
  <div
    class="flex items-center justify-between py-3"
    :class="emphasis ? 'pt-4 pb-0' : 'border-b border-gray-200'"
  >
    <p
      :class="
        emphasis
          ? 'text-base font-semibold text-gray-900'
          : 'text-sm text-gray-600'
      "
    >
      <slot name="label" />
    </p>
    <p
      :class="
        emphasis
          ? 'text-xl font-semibold tabular-nums text-gray-900'
          : 'text-sm font-medium tabular-nums text-gray-900'
      "
    >
      <slot name="value" />
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  emphasis?: boolean;
}>();
</script>
