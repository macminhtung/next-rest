import type { ElementType, ComponentProps } from 'react';
import { type Control, FieldPath, FieldValues } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui';
import {
  InputC,
  SelectC,
  MultiSelectC,
  PasswordC,
  CheckboxC,
  SwitchC,
  RadioGroupC,
  DatePickerC,
  RangeDatePickerC,
  UploadImageC,
} from '@/components/ui-customize';
import { EItemFieldType } from '@/components/form/enums';
import { cn } from '@/lib/utils';

type TItemProps =
  | { iType: EItemFieldType.INPUT; iProps?: ComponentProps<typeof InputC> }
  | { iType: EItemFieldType.PASSWORD; iProps?: ComponentProps<typeof PasswordC> }
  | { iType: EItemFieldType.SELECT; iProps: ComponentProps<typeof SelectC> }
  | { iType: EItemFieldType.MULTI_SELECT; iProps: ComponentProps<typeof MultiSelectC> }
  | { iType: EItemFieldType.TEXTAREA; iProps?: ComponentProps<typeof Textarea> }
  | { iType: EItemFieldType.CHECK_BOX; iProps?: ComponentProps<typeof CheckboxC> }
  | { iType: EItemFieldType.SWITCH; iProps?: ComponentProps<typeof SwitchC> }
  | { iType: EItemFieldType.RADIO_GROUP; iProps: ComponentProps<typeof RadioGroupC> }
  | { iType: EItemFieldType.DATE_PICKER; iProps?: ComponentProps<typeof DatePickerC> }
  | { iType: EItemFieldType.RANGE_DATE_PICKER; iProps?: ComponentProps<typeof RangeDatePickerC> }
  | { iType: EItemFieldType.UPLOAD_IMAGE; iProps?: ComponentProps<typeof UploadImageC> };

const ITEM_FIELDS_MAP = {
  [EItemFieldType.INPUT]: InputC,
  [EItemFieldType.PASSWORD]: PasswordC,
  [EItemFieldType.SELECT]: SelectC,
  [EItemFieldType.MULTI_SELECT]: MultiSelectC,
  [EItemFieldType.TEXTAREA]: Textarea,
  [EItemFieldType.CHECK_BOX]: CheckboxC,
  [EItemFieldType.SWITCH]: SwitchC,
  [EItemFieldType.RADIO_GROUP]: RadioGroupC,
  [EItemFieldType.DATE_PICKER]: DatePickerC,
  [EItemFieldType.RANGE_DATE_PICKER]: RangeDatePickerC,
  [EItemFieldType.UPLOAD_IMAGE]: UploadImageC,
};

export type TItemFieldC<T extends FieldValues> = TItemProps & {
  className?: string;
  label: string;
  fieldName: FieldPath<T>;
  itemFieldDescription?: string;
};

type TFormFieldC<T extends FieldValues> = TItemFieldC<T> & { control: Control<T, unknown, T> };

export const FormFieldC = <T extends FieldValues>(props: TFormFieldC<T>) => {
  const { iType, control, className, fieldName, label, iProps, itemFieldDescription } = props;
  const isHorizontal = [EItemFieldType.CHECK_BOX, EItemFieldType.SWITCH].includes(iType);
  const ItemField: ElementType = ITEM_FIELDS_MAP[iType];

  return (
    <FormField
      control={control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div
              className={cn(
                'flex gap-2 flex-col ',
                isHorizontal && 'flex-row-reverse justify-end items-center',
                className && className
              )}
            >
              <FormLabel>{label}</FormLabel>
              <ItemField {...field} {...iProps} onBlur={() => field.onBlur()} />
            </div>
          </FormControl>
          {itemFieldDescription && <FormDescription>{itemFieldDescription}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
