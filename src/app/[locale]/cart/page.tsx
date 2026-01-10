'use client';

import { useTranslations } from 'next-intl';
import { inventory } from './mockData';
import { useAppStore } from '@/store';
import { InputC } from '@/components/ui-customize';
import { ChangeEvent, useCallback } from 'react';

const CartPage = () => {
  const t = useTranslations();
  const cartInfo = useAppStore((state) => state.cartInfo);
  const setCartInfo = useAppStore((state) => state.setCartInfo);

  const onChangeCart = useCallback(
    (
      e: ChangeEvent<HTMLInputElement>,
      item: {
        name: string;
        unitPrice: number;
        quantity: number;
      }
    ) => {
      const quantity = +e.target.value;
      if (quantity) {
        setCartInfo({
          ...cartInfo,
          [item.name]: { unitPrice: item.unitPrice, quantity: +e.target.value },
        });
      } else {
        delete cartInfo[item.name];
        setCartInfo({ ...cartInfo });
      }
    },
    [cartInfo, setCartInfo]
  );

  return (
    <div className='size-full flex flex-col items-center gap-6'>
      <p className='text-3xl md:text-4xl font-bold my-5 text-shadow-neon'>{t('cart')}</p>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-5 overflow-auto'>
        {inventory.map((item) => {
          return (
            <div className='flex flex-col' key={item.name}>
              <p>
                {t('name')}: {item.name}
              </p>
              <p>
                {t('quantity')}: {item.quantity}
              </p>
              <p>
                {t('price')}: {item.unitPrice}
              </p>
              <InputC
                type='number'
                min={0}
                max={item.quantity}
                onChange={(e) => onChangeCart(e, item)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CartPage;
