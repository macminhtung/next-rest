'use client';

import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ImageIcon, XCircleIcon, LoaderCircle } from 'lucide-react';
import Image from 'next/image';
import Dropzone, { type DropzoneProps } from 'react-dropzone';
import { showToastError } from '@/common/funcs';

type TUploadImageC = {
  className?: string;
  value?: string; // Use for react-hook-form
  onChange?: Dispatch<SetStateAction<string>>; // Use for react-hook-form
  onUpload?: (file: File) => Promise<string>; // Uploading the file and return the fileURL
} & Omit<DropzoneProps, 'onDrop' | 'maxFiles'>;

export const UploadImageC = (props: TUploadImageC) => {
  const { className, value, onChange, onUpload, ...dropzoneProps } = props;
  const [profilePicture, setProfilePicture] = useState<string>(value || '');
  const [isUploading, setIsUploading] = useState<boolean>(false);

  return (
    <div className={cn('relative w-full max-w-40', className)}>
      {/* # ================= # */}
      {/* # ==> UPLOADING <== # */}
      {/* # ================= # */}
      {isUploading && (
        <div className='absolute top-0 z-[1] flex flex-col size-full items-center justify-center opacity-80 gap-6 bg-background'>
          <LoaderCircle className='text-primary scale-[2] animate-spin' />
          <p className='text-primary font-bold animate-bounce'>Uploading</p>
        </div>
      )}

      <div className='mt-1 w-full'>
        {profilePicture ? (
          // # ================== #
          // # ==> SHOW IMAGE <== #
          // # ================== #
          <div className='relative aspect-square'>
            <Button
              className='absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 h-fit !p-1 cursor-pointer rounded-[50%] z-10'
              onClick={() => {
                setProfilePicture('');
                if (onChange) onChange('');
              }}
            >
              <XCircleIcon className='h-5 w-5 fill-primary text-primary-foreground' />
            </Button>
            <Image
              alt='avatar'
              src={profilePicture}
              height={500}
              width={500}
              className='border-2 border-border h-full w-full rounded-md object-cover'
            />
          </div>
        ) : (
          // # ==================== #
          // # ==> SELECT IMAGE <== #
          // # ==================== #
          <Dropzone
            onDrop={(acceptedFiles: File[]) => {
              const file = acceptedFiles[0];
              if (file) {
                const fileURL = URL.createObjectURL(file);
                setProfilePicture(fileURL);
                if (onChange) onChange(fileURL);
                if (onUpload) {
                  setIsUploading(true);
                  onUpload(file)
                    .then((uploadedURL) => onChange && onChange(uploadedURL))
                    .catch((error) => showToastError(error))
                    .finally(() => setIsUploading(false));
                }
              }
            }}
            maxFiles={1}
            accept={{ 'image/png': ['.png', '.jpg', '.jpeg', '.webp'] }}
            {...dropzoneProps}
          >
            {({ getRootProps, getInputProps }) => (
              <div
                className='border border-dashed flex items-center justify-center aspect-square rounded-md'
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <ImageIcon className='h-16 w-16 scale-[2] text-primary' strokeWidth={1.5} />
              </div>
            )}
          </Dropzone>
        )}
      </div>
    </div>
  );
};
