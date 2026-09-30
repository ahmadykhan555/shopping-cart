import { computed, readonly } from "vue";
import useCalculateShippingCost from "./useCalculateShippingCost";
import useCart from "./useCart";

export default function useTotalWithShippingCost() {
  const { summary } = useCart();
  const { shippingCost } = useCalculateShippingCost();

  return {
    totalWithoutShippingCost: computed(() => summary.value.totalWithTax),
    totalWithShippingCost: computed(
      () => summary.value.totalWithTax + shippingCost.value,
    ),
    shippingCost: readonly(computed(() => shippingCost.value)),
  };
}
