'use client';

import { useCallback, useState } from 'react';
import type { ReactNode, ComponentProps } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Checkbox,
} from '@/components/ui';
import { type CheckedState } from '@radix-ui/react-checkbox';
import { Loader2 } from 'lucide-react';
import { PaginationC } from '@/components/ui-customize';
import { cn } from '@/lib/utils';

export type THeader<R> = {
  key: keyof R;
  title?: ReactNode;
  width?: string | number;
  render?: (record: R) => ReactNode;
};

export type TTableCProps<
  R extends Record<H[number]['key'], string | number>,
  H extends readonly THeader<R>[],
> = {
  rowRecords: R[];
  headers: H;
  rowKey: H[number]['key'];
  className?: string;
  loading?: boolean;
  pagination?: ComponentProps<typeof PaginationC>;
  selectMode?: {
    selectedRecords: Record<H[number]['key'], string | number>[];
    setSelectedRecords: (v: Record<H[number]['key'], string | number>[]) => void;
  };
};

export const TableC = <
  R extends Record<H[number]['key'], string | number>,
  const H extends readonly THeader<R>[],
>(
  props: TTableCProps<R, H>
) => {
  const { headers, rowRecords, className, pagination, loading, rowKey, selectMode } = props;
  const [checkedAllState, setCheckedAllState] = useState<CheckedState>(false);

  const onSelectAll = useCallback(() => {
    if (selectMode) {
      if (checkedAllState === 'indeterminate' || !checkedAllState) {
        setCheckedAllState(true);
        selectMode.setSelectedRecords(rowRecords);
      } else {
        setCheckedAllState(false);
        selectMode.setSelectedRecords([]);
      }
    }
  }, [checkedAllState, selectMode, rowRecords]);

  const onSelectRow = useCallback(
    (checked: CheckedState, record: R) => {
      if (selectMode) {
        const { selectedRecords, setSelectedRecords } = selectMode;
        const newSelectedRecord = checked
          ? [...selectedRecords, record]
          : selectedRecords.filter((i) => i[rowKey] !== record[rowKey]);

        if (newSelectedRecord.length === rowRecords.length) setCheckedAllState(true);
        else if (newSelectedRecord.length) setCheckedAllState('indeterminate');
        else setCheckedAllState(false);

        setSelectedRecords(newSelectedRecord);
      }
    },
    [selectMode, rowKey, rowRecords.length]
  );

  return (
    <div className={cn('grid w-full [&>div]:border [&>div]:rounded relative', className)}>
      {loading && (
        <div className='absolute z-10 bg-background opacity-70 size-full flex items-center justify-center'>
          <Loader2 className={cn('animate-spin text-primary')} size={40} />
        </div>
      )}
      <Table>
        <TableHeader className='h-12'>
          <TableRow className='[&>*]:whitespace-nowrap sticky top-0 !bg-background shadow z-10'>
            {headers.map((item, idx) => (
              <TableHead
                key={`${idx}-${String(item.key)}`}
                className={cn(!idx && 'pl-4')}
                style={{ width: item.width || 'auto' }}
              >
                {selectMode && item.key === rowKey && (
                  <Checkbox
                    className='mr-2'
                    checked={checkedAllState}
                    onCheckedChange={onSelectAll}
                  />
                )}
                {item.title}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rowRecords.map((record, idxR) => (
            <TableRow key={idxR} className='odd:bg-muted/50 [&>*]:whitespace-nowrap h-11'>
              {headers.map((header, idxH) => (
                <TableCell key={String(header.key)} className={cn(!idxH && 'pl-4')}>
                  {selectMode && header.key === rowKey && (
                    <Checkbox
                      className='mr-2'
                      checked={
                        !!selectMode.selectedRecords.find((i) => i[rowKey] === record[rowKey])
                      }
                      onCheckedChange={(checked) => onSelectRow(checked, record)}
                    />
                  )}
                  {header.render ? header.render(record) : record[header.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {pagination && <PaginationC {...pagination} />}
    </div>
  );
};
