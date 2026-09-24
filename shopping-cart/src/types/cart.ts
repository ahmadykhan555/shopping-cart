export type CartItem = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  quantity: number;
};

export type CartSummary = {
  total: number;
  tax: number;
  count: number;
  shippingCost: number;
  totalWithTax: number;
};
