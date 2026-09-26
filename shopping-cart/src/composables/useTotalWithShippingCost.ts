import { computed } from "vue";
import useCalculateShippingCost from "./useCalculateShippingCost";
import useCart from "./useCart";

export default function useTotalWithShippingCost() {
  const { summary } = useCart();
  const { shippingCost } = useCalculateShippingCost();

  return {
    totalWithoutShippingCost: computed(() => summary.value.total),
    totalWithShippingCost: computed(
      () => summary.value.totalWithTax + shippingCost.value,
    ),
    shippingCost: computed(() => shippingCost.value),
  };
}
