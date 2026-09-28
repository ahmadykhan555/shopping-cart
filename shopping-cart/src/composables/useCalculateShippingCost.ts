import { readonly, ref } from "vue";

const shippingCost = ref(0);
export default function useCalculateShippingCost() {
  const calculateShippingCost = () => {
    const minEuros = 5;
    const maxEuros = 10;
    shippingCost.value = Number(
      (minEuros + Math.random() * (maxEuros - minEuros)).toFixed(2),
    );
  };

  return {
    calculateShippingCost,
    shippingCost: readonly(shippingCost),
  };
}
