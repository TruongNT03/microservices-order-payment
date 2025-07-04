import { SelectQueryBuilder } from 'typeorm';

interface PaginateResult<T> {
  data: T[];
  currentPage: number;
  totalPage: number;
  limit: number;
}

export const paginate = async (
  q: SelectQueryBuilder<any>,
  page: number,
  limit: number,
): Promise<PaginateResult<any>> => {
  const [data, total] = await q
    .take(limit)
    .skip((page - 1) * limit)
    .getManyAndCount();
  return {
    data,
    currentPage: page,
    totalPage: Math.ceil(total / limit),
    limit: limit,
  };
};
