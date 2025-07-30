'use client';

import { useMemo } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { SelectC } from '@/components/ui-customize';
import { cn } from '@/lib/utils';

type TPaginationProps = {
  page?: number;
  take?: number;
  total?: number;
  className?: string;
  setPagination?: (payload: { page: number; take: number }) => void;
};

const NUM_RECORDS_PER_PAGE = [10, 20, 50, 100];

export const PaginationC = (props: TPaginationProps) => {
  const { page = 1, total = 1, take = 1, className, setPagination } = props;
  const prevPages = useMemo(() => [page - 2, page - 1].filter((prevP) => prevP > 0), [page]);
  const pageQuantity = useMemo(() => Math.ceil(total / take), [take, total]);
  const nextPages = useMemo(
    () => [page + 1, page + 2].filter((prevP) => prevP <= pageQuantity),
    [page, pageQuantity]
  );

  return (
    <div className={cn('mt-4 h-11 flex !border-0 overflow-x-auto', className)}>
      <div className='flex w-full'>
        <Pagination className='flex w-fit mx-0 ml-auto'>
          <PaginationContent>
            {/* [PREVIOUS] BUTTON */}
            {page > 1 && (
              <PaginationItem
                className='cursor-pointer'
                onClick={setPagination && (() => setPagination({ page: page - 1, take }))}
              >
                <PaginationPrevious />
              </PaginationItem>
            )}

            {/* [PREV ELLIPSIS] BUTTON */}
            {page - 3 > 1 && (
              <PaginationItem className='cursor-pointer hover:bg-accent rounded-md'>
                <PaginationEllipsis
                  onClick={
                    setPagination &&
                    (() => setPagination({ page: page - 5 <= 0 ? 1 : page - 5, take }))
                  }
                />
              </PaginationItem>
            )}

            {/* [PREVIOUS PAGES] BUTTON */}
            {prevPages.map((prevP) => (
              <PaginationItem
                key={prevP}
                className='cursor-pointer'
                onClick={setPagination && (() => setPagination({ page: prevP, take }))}
              >
                <PaginationLink>{prevP}</PaginationLink>
              </PaginationItem>
            ))}

            {/* [ACTIVE] PAGE */}
            <PaginationItem className='cursor-pointer'>
              <PaginationLink isActive>{page}</PaginationLink>
            </PaginationItem>

            {/* [NEXT PAGES] BUTTON */}
            {nextPages.map((nextP) => (
              <PaginationItem
                key={nextP}
                className='cursor-pointer'
                onClick={setPagination && (() => setPagination({ page: nextP, take }))}
              >
                <PaginationLink>{nextP}</PaginationLink>
              </PaginationItem>
            ))}

            {/* [NEXT ELLIPSIS] BUTTON */}
            {page + 3 <= pageQuantity && (
              <PaginationItem className='cursor-pointer hover:bg-accent rounded-md'>
                <PaginationEllipsis
                  onClick={
                    setPagination &&
                    (() =>
                      setPagination({
                        page: page + 5 < pageQuantity ? page + 5 : pageQuantity,
                        take,
                      }))
                  }
                />
              </PaginationItem>
            )}

            {/* [NEXT] BUTTON */}
            {page < pageQuantity && (
              <PaginationItem
                className='cursor-pointer'
                onClick={setPagination && (() => setPagination({ page: page + 1, take }))}
              >
                <PaginationNext />
              </PaginationItem>
            )}

            {/* [NUMBER RECORDS / PAGE] SELECTOR */}
            <SelectC
              className='w-30 ml-1 min-h-9 focus-visible:!ring-[0px]'
              options={NUM_RECORDS_PER_PAGE.map((num) => ({
                label: `${num} / page`,
                value: num.toString(),
              }))}
              onChange={(take) => setPagination && setPagination({ page: 1, take: +take })}
            />
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};
