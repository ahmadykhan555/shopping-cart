export type CartItem = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  images: readonly string[];
  quantity: number;
};

export type CartSummary = {
  total: number;
  tax: number;
  count: number;
  totalWithTax: number;
};
