'use client';

import { useState } from 'react';
import { InputC, TInputCProps } from '@/components/ui-customize';
import EyeOpenIcon from '@/common/icons/eye-open.svg';
import EyeCloseIcon from '@/common/icons/eye-close.svg';

export type TPasswordCProps = Omit<TInputCProps, 'type' | 'endItem'>;

export const PasswordC = (props: TPasswordCProps) => {
  const { className, ...rest } = props;
  const [show, setShow] = useState(false);

  return (
    <InputC
      type={show ? undefined : 'password'}
      className={className}
      {...rest}
      endItem={
        <div onClick={() => setShow(!show)}>
          {show ? (
            <EyeOpenIcon className='dark:[&>path]:text-background' />
          ) : (
            <EyeCloseIcon className='dark:[&>path]:text-background' />
          )}
        </div>
      }
    />
  );
};
