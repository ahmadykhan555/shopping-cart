export type CheckoutOrderSummary = {
  itemCount: number;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
};

export type CheckoutSuccessHistoryState = {
  itemCount?: number;
  orderSummary?: CheckoutOrderSummary;
};
