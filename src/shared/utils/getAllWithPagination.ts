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
  EntityMetadata,
  Repository,
  SelectQueryBuilder,
  WhereExpressionBuilder,
} from 'typeorm';
import { PaginatorInfo } from '../types/dto/pagination-result.type';

const relationsForQuery = new Map();

function addRelationWithInfo<T>(
  fieldNodes: any[],
  qb: SelectQueryBuilder<T>,
  metadata: EntityMetadata,
  alias: string,
) {
  for (const field of fieldNodes) {
    if (!field.selectionSet) continue;

    const relation = metadata.relations.find(
      (rel) => rel.propertyName === field.name.value,
    );

    if (!relation) continue;

    const propertyName = `${alias}.${relation.propertyName}`;
    const relationAlias = `${alias}-${relation.propertyName}`;

    console.log('name', propertyName, relationAlias);

    if (
      !qb.expressionMap.joinAttributes.some(
        (join) => join.alias.name === relationAlias,
      )
    ) {
      relationsForQuery.set(propertyName, relationAlias);
      // qb.leftJoinAndSelect(propertyName, relationAlias);
    }

    addRelationWithInfo(
      field.selectionSet.selections,
      qb,
      relation.inverseEntityMetadata,
      relationAlias,
    );
  }
}

function applyWhereFilter<T>(
  entityName: string,
  query: SelectQueryBuilder<T>,
  qb: SelectQueryBuilder<T> | WhereExpressionBuilder,
  where: PaginatorWhere,
  metadata: EntityMetadata,
  call?: string,
): void {
  if (!where) {
    return;
  }

  if (where?.and) {
    qb.andWhere(
      new Brackets((subQb) => {
        for (const part of where.and!) {
          applyWhereFilter(
            entityName,
            query,
            subQb,
            part,
            metadata,
            'andWhere',
          );
        }
      }),
    );
  } else if (where?.or) {
    qb.orWhere(
      new Brackets((subQb) => {
        for (const part of where.or!) {
          applyWhereFilter(entityName, query, subQb, part, metadata, 'orWhere');
        }
      }),
    );
  } else {
    const { column } = where;

    const fields = `${entityName}->${column}`.split('->');
    let fieldPath = `${fields.slice(0, fields.length - 1).join('-')}`;

    if (fields.length > 1) {
      const relationPath = fields.slice(0, fields.length - 1).join('-');
      let lastRelation = '';

      if (
        !query.expressionMap.joinAttributes.some((join) => {
          if (
            relationPath.includes(join.alias.name) &&
            lastRelation.length < join.alias.name.length
          ) {
            lastRelation = join.alias.name;
          }
          return join.alias.name === relationPath;
        })
      ) {
        const addedRelations = relationPath
          .replace(lastRelation ? `${lastRelation}-` : '', '')
          .split('-');

        console.log('last', lastRelation, relationPath, addedRelations);
        let currentRelationAdd = lastRelation;

        for (const addedRelation of addedRelations) {
          currentRelationAdd += currentRelationAdd
            ? `.${addedRelation}`
            : addedRelation;

          if (currentRelationAdd.includes('.')) {
            relationsForQuery.set(
              currentRelationAdd,
              currentRelationAdd.replaceAll('.', '-'),
            );
            // query.leftJoinAndSelect(
            //   currentRelationAdd,
            //   currentRelationAdd.replaceAll('.', '-'),
            // );
          }

          currentRelationAdd = currentRelationAdd.replaceAll('.', '-');
          fieldPath = currentRelationAdd;
        }
      }
    }

    fieldPath += `.${fields[fields.length - 1]}`;

    console.log('field', fieldPath);

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
  info: any,
  entityName: string,
  repository: Repository<T>,
  page: number,
  perPage: number,
  where?: PaginatorWhere,
  orderBy?: PaginatorOrderBy,
) {
  const query = repository.createQueryBuilder(entityName);

  const fieldNodes =
    info.fieldNodes[0].selectionSet.selections[0].selectionSet.selections;
  addRelationWithInfo<T>(fieldNodes, query, repository.metadata, entityName);

  applyWhereFilter(
    entityName,
    query,
    query,
    where,
    repository.metadata,
    'orWhere',
  );

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

  query.skip(offset).take(perPage);

  relationsForQuery.forEach((value, key) => {
    query.leftJoinAndSelect(key, value);
  });

  console.log('query', query.getQuery());

  const [data, totalElements] = await query.getManyAndCount();

  const totalPages = Math.ceil(totalElements / perPage);

  const paginationMeta: PaginatorInfo = {
    page,
    perPage,
    count: totalElements,
    hasMorePages: totalPages > page,
    totalPages: totalPages,
  };

  return { data, paginatorInfo: paginationMeta };
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
