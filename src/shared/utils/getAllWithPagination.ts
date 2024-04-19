import {
  PaginatorWhere,
  PaginatorWhereOperator,
} from '../types/dto/paginator-where.type';
import {
  PaginatorOrderBy,
  PaginatorOrderByOrder,
} from '../types/dto/paginator-order-by.type';
import {
  Brackets,
  Repository,
  SelectQueryBuilder,
  WhereExpressionBuilder,
} from 'typeorm';

function applyWhereFilter<T>(
  qb: SelectQueryBuilder<T> | WhereExpressionBuilder,
  where: PaginatorWhere,
  call?: string,
): void {
  if (!where) {
    return;
  }

  if (where?.and) {
    qb.andWhere(
      new Brackets((subQb) => {
        for (const part of where.and!) {
          applyWhereFilter(subQb, part, 'andWhere');
        }
      }),
    );
  } else if (where?.or) {
    qb.orWhere(
      new Brackets((subQb) => {
        for (const part of where.or!) {
          applyWhereFilter(subQb, part, 'orWhere');
        }
      }),
    );
  } else {
    const parts = where.column.split('->');

    const fieldPath = parts.reduce((path, part, index) => {
      if (index === 0) return `${part}`;
      return `${path}.${part}`;
    }, '');

    if (where?.operator === PaginatorWhereOperator.FTS) {
      qb[call](`${fieldPath} LIKE '%${where.value}%'`);
    } else if (where.operator === PaginatorWhereOperator.EQ) {
      qb[call](`${fieldPath} = '${where.value}'`);
    } else if (where.operator === PaginatorWhereOperator.NEQ) {
      qb[call](`${fieldPath} != '${where.value}'`);
    }
  }
}

export default async function getAllWithPagination<T = any>(
  repository: Repository<T>,
  page: number,
  perPage: number,
  where?: PaginatorWhere,
  orderBy?: PaginatorOrderBy,
) {
  const query = repository.createQueryBuilder();

  if (where) {
    applyWhereFilter(query, where, 'orWhere');
  }

  if (orderBy) {
    switch (orderBy.order) {
      case PaginatorOrderByOrder.ASC:
        query.orderBy(`${orderBy.column}`, 'ASC');
        break;
      case PaginatorOrderByOrder.DESC:
        query.orderBy(`${orderBy.column}`, 'DESC');
        break;
    }
  }

  const offset = (page - 1) * perPage;

  const [data] = await query.offset(offset).limit(perPage).getManyAndCount();

  return data;
}

// const totalPages = Math.ceil(total / perPage);

// const paginationMeta: PaginatorInfo = {
//   page,
//   perPage,
//   count: total,
//   hasMorePages: totalPages > page,
//   total: totalPages,
// };

// console.log('data', data, total);

// return {
//   data,
//   paginatorInfo: paginationMeta,
// };
