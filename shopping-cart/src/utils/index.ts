import { MAX_SHIPPING_COST, MIN_SHIPPING_COST } from "@/consts";

export * from "./cart";

export const formatMoney = (value: number): string => {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(value);
};

export const calculateRandomShippingCost = () => {
  return Number(
    (
      MIN_SHIPPING_COST +
      Math.random() * (MAX_SHIPPING_COST - MIN_SHIPPING_COST)
    ).toFixed(2),
  );
};
