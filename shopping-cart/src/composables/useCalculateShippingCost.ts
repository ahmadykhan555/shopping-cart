import { MAX_SHIPPING_COST, MIN_SHIPPING_COST } from "@/consts";
import { readonly, ref } from "vue";

const shippingCost = ref(0);
export default function useCalculateShippingCost() {
  const calculateShippingCost = () => {
    const minEuros = MIN_SHIPPING_COST;
    const maxEuros = MAX_SHIPPING_COST;
    shippingCost.value = Number(
      (minEuros + Math.random() * (maxEuros - minEuros)).toFixed(2),
    );
  };

  return {
    calculateShippingCost,
    shippingCost: readonly(shippingCost),
  };
}
