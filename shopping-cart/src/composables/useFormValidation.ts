import { computed, reactive, ref, type MaybeRefOrGetter, toValue } from "vue";

export type FormFieldRules<T extends Record<string, string>> = {
  [K in keyof T]: {
    label?: string;
    required?: boolean;
    validateField?: (value: string, form: T) => string | null;
  };
};

export default function useFormValidation<T extends Record<string, string>>(
  form: MaybeRefOrGetter<T>,
  fieldRules: FormFieldRules<T>,
) {
  const fieldKeys = Object.keys(fieldRules) as (keyof T & string)[];

  const touched = reactive<Record<string, boolean>>(
    Object.fromEntries(fieldKeys.map((key) => [key, false])),
  );

  const submitAttempted = ref(false);

  const getFieldError = (key: keyof T & string): string | null => {
    const rules = fieldRules[key as keyof T];
    if (!rules) {
      return null;
    }

    const formValues = toValue(form);
    const value = (formValues[key as keyof T] ?? "").trim();

    if (rules.required && !value) {
      return `${rules.label ?? key} is required`;
    }

    if (rules.validateField) {
      return rules.validateField(value, formValues);
    }

    return null;
  };

  const errors = computed(() => {
    const result: Partial<Record<keyof T, string>> = {};

    for (const key of fieldKeys) {
      if (!submitAttempted.value && !touched[key]) {
        continue;
      }

      const message = getFieldError(key);
      if (message) {
        result[key as keyof T] = message;
      }
    }

    return result;
  });

  const isValid = computed(() =>
    fieldKeys.every((key) => getFieldError(key) === null),
  );

  const markTouched = (key: keyof T) => {
    touched[String(key)] = true;
  };

  const markAllTouched = () => {
    for (const key of fieldKeys) {
      touched[key] = true;
    }
  };

  const validateForm = () => {
    submitAttempted.value = true;
    markAllTouched();
    return isValid.value;
  };

  return {
    errors,
    isValid,
    markTouched,
    validateForm,
  };
};
