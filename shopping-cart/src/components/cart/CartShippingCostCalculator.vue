<template>
  <div class="mt-6 rounded-xl border border-gray-200 bg-gray-50/50 p-6">
    <AppButton
      type="button"
      variant="ghost"
      class="flex w-full items-center justify-between gap-2 text-left text-gray-900"
      :aria-expanded="!isCollapsed"
      aria-controls="shipping-calculator-panel"
      @click="toggleCollapsed"
    >
      <span>Calculate Shipping</span>
      <span class="text-sm font-normal text-gray-500" aria-hidden="true">
        {{ isCollapsed ? "Show" : "Hide" }}
      </span>
    </AppButton>

    <div
      v-if="shippingCost > 0"
      class="mt-3 flex items-center justify-between border-t border-gray-200 pt-3"
    >
      <span class="text-sm text-gray-600">Estimated shipping</span>
      <span class="text-base font-semibold tabular-nums text-gray-900">
        {{ formatMoney(shippingCost) }}
      </span>
    </div>

    <div v-show="!isCollapsed" id="shipping-calculator-panel" class="mt-5">
      <form class="flex flex-col gap-4" @submit.prevent>
        <input
          v-for="field in calculatorFields"
          :key="field.key"
          v-model="form[field.key]"
          :type="field.type"
          :inputmode="field.inputmode"
          :placeholder="field.placeholder"
          :aria-label="field.label"
          class="w-full border-0 border-b border-gray-300 bg-transparent py-2 text-base text-gray-900 placeholder:text-gray-400 focus:border-gray-600 focus:outline-none"
        />

        <AppButton
          :disabled="isDisabled"
          type="button"
          class="mt-2 w-full py-3"
          variant="secondary"
          @click="handleCalculateShipping"
        >
          Calculate Shipping
        </AppButton>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import AppButton from "../base/AppButton.vue";
import useCalculateShippingCost from "@/composables/useCalculateShippingCost";
import { formatMoney } from "@/utils";

type ShippingForm = {
  origin: string;
  destination: string;
  postalCode: string;
};

type FieldKey = keyof ShippingForm;

const form = reactive<ShippingForm>({
  origin: "",
  destination: "",
  postalCode: "",
});

const { calculateShippingCost, shippingCost } = useCalculateShippingCost();
const isCollapsed = ref(false);

const isDisabled = computed(
  () =>
    !form.origin.trim() || !form.destination.trim() || !form.postalCode.trim(),
);

const toggleCollapsed = () => {
  isCollapsed.value = !isCollapsed.value;
};

const calculatorFields: {
  key: FieldKey;
  label: string;
  placeholder: string;
  type: "text";
  inputmode?: "numeric";
}[] = [
  {
    key: "origin",
    label: "Origin",
    placeholder: "Enter origin",
    type: "text",
  },
  {
    key: "destination",
    label: "Destination",
    placeholder: "Enter destination",
    type: "text",
  },
  {
    key: "postalCode",
    label: "Postal code",
    placeholder: "Enter postal code",
    type: "text",
    inputmode: "numeric",
  },
];

const handleCalculateShipping = () => {
  calculateShippingCost();
};
</script>
