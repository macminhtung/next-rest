export type TProduct = {
  id: string;
  image: string;
  name: string;
  description: string;
  unitPrice: number;
};

export type TCreateProduct = Omit<TProduct, 'id'>;
