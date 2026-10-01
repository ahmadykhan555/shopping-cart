import { beforeEach, describe, it, expect } from "vitest";
import { reactive } from "vue";
import useFormValidation from "../useFormValidation";
import type { FormFieldRules } from "@/types";

type TestForm = {
  name: string;
  code: string;
};

describe("useFormValidation composable", () => {
  const form = reactive<TestForm>({ name: "", code: "" });

  const fieldRules: FormFieldRules<TestForm> = {
    name: {
      label: "Name",
      required: true,
    },
    code: {
      label: "Code",
      required: true,
      validateField: (value) =>
        /^[A-Z]{2}$/.test(value) ? null : "Use two uppercase letters",
    },
  };

  beforeEach(() => {
    form.name = "";
    form.code = "";
  });

  it("reports valid when all fields pass rules", () => {
    form.name = "Ada";
    form.code = "DE";

    const { isValid, errors } = useFormValidation(form, fieldRules);

    expect(isValid.value).toBe(true);
    expect(errors.value).toEqual({});
  });

  it("does not show errors until a field is touched or submit is attempted", () => {
    form.name = "";
    form.code = "";

    const { errors, markTouched } = useFormValidation(form, fieldRules);

    expect(errors.value).toEqual({});

    markTouched("name");

    expect(errors.value).toEqual({ name: "Name is required" });
  });

  it("validateForm marks all fields touched and returns false when invalid", () => {
    form.name = "Ada";
    form.code = "de";

    const { validateForm, isValid, errors } = useFormValidation(form, fieldRules);

    expect(validateForm()).toBe(false);
    expect(isValid.value).toBe(false);
    expect(errors.value.code).toBe("Use two uppercase letters");
  });

  it("validateForm returns true when the form is valid", () => {
    form.name = "Ada";
    form.code = "DE";

    const { validateForm, errors } = useFormValidation(form, fieldRules);

    expect(validateForm()).toBe(true);
    expect(errors.value).toEqual({});
  });
});
