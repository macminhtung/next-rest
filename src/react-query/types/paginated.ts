import type { EOrder } from '@/common/enums';

export type TGetPaginatedRecords = {
  order?: EOrder;
  page?: number;
  take?: number;
  keySearch?: string;
  isDeleted?: boolean;
  includeIds?: string[];
  excludeIds?: string[];
  createdFrom?: string;
  createdTo?: string;
  isSelectAll?: boolean;
};

export type TPaginatedRecordsResponse<E extends object> = {
  page: number;
  take: number;
  total: number;
  records: E[];
};
