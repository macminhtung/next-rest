export type TProduct = {
  id: string;
  image: string;
  name: string;
  description: string;
};

export type TCreateProduct = Omit<TProduct, 'id'>;
