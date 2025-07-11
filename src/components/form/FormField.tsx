import type { ElementType, ComponentProps } from 'react';
import {
  ZodObject,
  objectOutputType,
  objectInputType,
  ZodTypeAny,
  ZodArray,
  z,
  ZodType,
  ZodEffects,
} from 'zod';
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

type TZodO = ZodObject<
  FieldValues,
  'strip',
  ZodTypeAny,
  objectOutputType<FieldValues, ZodTypeAny, 'strip'>,
  objectInputType<FieldValues, ZodTypeAny, 'strip'>
>;

export type TZodSchema = TZodO | ZodArray<ZodTypeAny> | ZodEffects<TZodO, unknown> | ZodType;

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

export type TItemFieldC<T extends TZodSchema> = TItemProps & {
  className?: string;
  label: string;
  fieldName: FieldPath<z.infer<T>>;
  itemFieldDescription?: string;
};

type TFormFieldC<T extends TZodSchema> = TItemFieldC<T> & {
  control: Control<FieldValues, unknown, FieldValues>;
  schema: TZodSchema;
};

const checkIsRequired = (schema: TZodSchema, fieldName: string) =>
  (schema instanceof ZodObject && !schema.shape[fieldName].isOptional()) ||
  (schema instanceof ZodArray && !schema.element.shape[fieldName].isOptional()) ||
  (schema instanceof ZodEffects && !schema._def.schema.shape[fieldName].isOptional());

export const FormFieldC = <T extends TZodSchema>(props: TFormFieldC<T>) => {
  const { iType, control, schema, className, fieldName, label, iProps, itemFieldDescription } =
    props;

  const ItemField: ElementType = ITEM_FIELDS_MAP[iType];
  const isHorizontal = [EItemFieldType.CHECK_BOX, EItemFieldType.SWITCH].includes(iType);

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
              <FormLabel>
                {label}
                {checkIsRequired(schema, field.name) && <span className='text-red-500'>*</span>}
              </FormLabel>

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
