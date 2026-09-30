export type FormFieldRules<T extends Record<string, string>> = {
  [K in keyof T]: {
    label?: string;
    required?: boolean;
    validateField?: (value: string, form: T) => string | null;
  };
};
