<template>
  <div
    class="mt-6 rounded-xl border border-gray-200 bg-gray-50/50 max-md:p-4 p-6"
  >
    <AppButton
      type="button"
      aria-label="Toggle shipping calculator"
      variant="ghost"
      class="flex w-full items-center justify-between gap-2 text-left text-gray-900"
      :aria-expanded="collapsible ? !isCollapsed : true"
      aria-controls="shipping-calculator-panel"
      @click="toggleCollapsed"
    >
      <span :class="collapsible ? 'text-lg font-semibold' : 'font-normal'">
        Calculate Shipping
      </span>
      <span
        v-if="collapsible"
        class="text-sm font-normal text-gray-500"
        aria-hidden="true"
      >
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

    <div
      v-show="!collapsible || !isCollapsed"
      id="shipping-calculator-panel"
      class="mt-5"
    >
      <form
        class="flex flex-col gap-4"
        novalidate
        @submit.prevent="handleCalculateShipping"
      >
        <div
          v-for="field in calculatorFields"
          :key="field.key"
          class="flex flex-col gap-1"
        >
          <input
            :id="`shipping-${field.key}`"
            v-model="form[field.key]"
            :type="field.type"
            :inputmode="field.inputmode"
            :placeholder="field.placeholder"
            :aria-label="field.label"
            :aria-invalid="errors[field.key] ? true : undefined"
            :aria-describedby="
              errors[field.key] ? `shipping-${field.key}-error` : undefined
            "
            class="w-full border-0 border-b bg-transparent py-2 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none"
            :class="
              errors[field.key]
                ? 'border-red-500 focus:border-red-600'
                : 'border-gray-300 focus:border-gray-600'
            "
            @blur="markTouched(field.key)"
          />
          <p
            v-if="errors[field.key]"
            :id="`shipping-${field.key}-error`"
            class="text-sm text-red-600"
            role="alert"
          >
            {{ errors[field.key] }}
          </p>
        </div>

        <AppButton
          type="submit"
          class="mt-2 w-full py-3"
          aria-label="Calculate shipping"
          variant="secondary"
          :disabled="!isValid"
        >
          Calculate Shipping
        </AppButton>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import AppButton from "../base/AppButton.vue";
import { useFormValidation } from "@/composables";
import type { FormFieldRules } from "@/types";
import { calculateRandomShippingCost, formatMoney } from "@/utils";

type ShippingForm = {
  origin: string;
  destination: string;
  postalCode: string;
};

type FieldKey = keyof ShippingForm;

const props = withDefaults(
  defineProps<{
    shippingCost?: number;
    collapsible?: boolean;
    initialCollapsed?: boolean;
  }>(),
  {
    shippingCost: 0,
    collapsible: false,
    initialCollapsed: true,
  },
);

const emit = defineEmits<{
  "update:shippingCost": [cost: number];
}>();

const form = reactive<ShippingForm>({
  origin: "Stuttgart",
  destination: "",
  postalCode: "",
});

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

const fieldRules: FormFieldRules<ShippingForm> = {
  origin: {
    label: "Origin",
    required: true,
    validateField: (value) =>
      value.length < 2 ? "Must be at least 2 characters" : null,
  },
  destination: {
    label: "Destination",
    required: true,
    validateField: (value) =>
      value.length < 2 ? "Must be at least 2 characters" : null,
  },
  postalCode: {
    label: "Postal code",
    required: true,
    validateField: (value) =>
      /^[a-zA-Z0-9\s-]{3,12}$/.test(value)
        ? null
        : "Enter a valid postal code (3–12 characters)",
  },
};

const { errors, markTouched, validateForm, isValid } = useFormValidation(
  form,
  fieldRules,
);

const isCollapsed = ref(props.initialCollapsed);

const toggleCollapsed = () => {
  if (!props.collapsible) {
    return;
  }
  isCollapsed.value = !isCollapsed.value;
};

const handleCalculateShipping = () => {
  if (!validateForm()) {
    return;
  }
  emit("update:shippingCost", calculateRandomShippingCost());
};
</script>
