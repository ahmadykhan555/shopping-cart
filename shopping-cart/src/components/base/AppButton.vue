<template>
  <button :disabled="disabled" :class="buttonClasses" :aria-label="ariaLabel">
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    variant?: "primary" | "secondary" | "danger" | "ghost" | "link";
    disabled?: boolean;
    ariaLabel?: string;
  }>(),
  {
    variant: "primary",
    ariaLabel: "button",
  },
);

const buttonClasses = computed(() => {
  if (props.variant === "ghost") {
    return [
      "inline-flex cursor-pointer items-center border-0 bg-transparent p-0 font-inherit text-inherit shadow-none outline-none",
      "rounded-none ring-0",
      props.disabled ? "cursor-not-allowed opacity-50" : "",
    ];
  }

  return [
    "cursor-pointer rounded-md px-4 py-2.5 text-sm font-semibold leading-snug text-white",
    {
      "bg-blue-500": props.variant === "primary",
      "bg-green-500": props.variant === "secondary",
      "bg-red-500": props.variant === "danger",
      "bg-purple-500": props.variant === "link",
    },
    props.disabled ? "cursor-not-allowed opacity-50" : "",
  ];
});
</script>
