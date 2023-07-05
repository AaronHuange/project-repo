import { Brackets } from 'typeorm';
import { WhereExpressionBuilder } from 'typeorm/query-builder/WhereExpressionBuilder';
import { convertArrayOfStringIntoStringNumber } from '@/utils/functions';
import {
  FILTER_DECORATOR_CUSTOM_FIELDS_METADATA_KEY,
  FILTER_DECORATOR_INDEX_METADATA_KEY,
  FILTER_DECORATOR_OPTIONS_METADATA_KEY,
  FILTER_OPERATION_PREFIX,
} from './constants';
import { GraphqlFilterFieldMetadata } from './field.decorator';
import { IFilterDecoratorParams } from './filter.decorator';
import { IFilter, OperationQuery } from './input-type-generator';

export const applyFilterParameter = (args: any[], target, property: string) => {
  const filterArgIndex = Reflect.getMetadata(
    FILTER_DECORATOR_INDEX_METADATA_KEY,
    target,
    property,
  );
  if (filterArgIndex !== undefined) {
    const options = Reflect.getMetadata(
      FILTER_DECORATOR_OPTIONS_METADATA_KEY,
      target,
      property,
    ) as IFilterDecoratorParams;
    const customFields = Reflect.getMetadata(
      FILTER_DECORATOR_CUSTOM_FIELDS_METADATA_KEY,
      target,
      property,
    ) as Map<string, GraphqlFilterFieldMetadata>;
    // eslint-disable-next-line @typescript-eslint/no-use-before-define,no-param-reassign
    args[filterArgIndex] = convertParameters(
      args[filterArgIndex],
      customFields,
      options,
    );
  }
};

// 递归处理嵌套查询参数
const recursionConvertParameters = <T>(
  qb: WhereExpressionBuilder,
  parameters?: IFilter<T>,
  customFields?: Map<string, GraphqlFilterFieldMetadata>,
  options?: IFilterDecoratorParams,
) => {
  const baseParameters = { ...parameters };
  delete baseParameters.or;
  delete baseParameters.and;

  if (parameters?.and) {
    const andParameters = parameters?.and;
    if (andParameters?.length) {
      // eslint-disable-next-line no-restricted-syntax
      for (const query of andParameters) {
        qb.andWhere(
          new Brackets((andBracketsQb) => {
            recursionConvertParameters(
              andBracketsQb,
              query as IFilter<T>,
              customFields,
              options,
            );
          }),
        );
      }
    }
  }
  if (parameters?.or) {
    const orParameters = parameters?.or;
    if (orParameters?.length) {
      if (Array.isArray(orParameters)) {
        // eslint-disable-next-line no-restricted-syntax
        for (const query of orParameters) {
          qb.orWhere(
            new Brackets((andBracketsQb) => {
              recursionConvertParameters(
                andBracketsQb,
                query as IFilter<T>,
                customFields,
                options,
              );
            }),
          );
        }
      } else {
        qb.orWhere(
          new Brackets((andBracketsQb) => {
            recursionConvertParameters(
              andBracketsQb,
              orParameters,
              customFields,
              options,
            );
          }),
        );
      }
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const basicParameters = recursivelyTransformComparators(
    baseParameters,
    customFields,
    options?.sqlAlias,
  );
  if (basicParameters) {
    qb.andWhere(
      new Brackets((basicParametersQb) => {
        // eslint-disable-next-line no-restricted-syntax
        for (const query of basicParameters) {
          basicParametersQb.andWhere(query[0], query[1]);
        }
      }),
    );
  }
};

const convertParameters = <T>(
  parameters?: IFilter<T>,
  customFields?: Map<string, GraphqlFilterFieldMetadata>,
  options?: IFilterDecoratorParams,
) => {
  // For tests purposes. If you provide Brackets instead of object to the decorator,
  // it will use your brackets without processing it.
  if (parameters && 'whereFactory' in parameters) return parameters;

  return new Brackets((qb) => {
    if (parameters == null) {
      return;
    }
    recursionConvertParameters(qb, parameters, customFields, options);
  });
};

const recursivelyTransformComparators = (
  object: Record<string, any>,
  extendedParams?: Map<string, GraphqlFilterFieldMetadata>,
  sqlAlias?: string,
) => {
  if (!object || !Object.entries(object).length) return null;
  const typeormWhereQuery = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(object)) {
    if (typeof value === 'object') {
      const operators = Object.entries(value as Record<string, any>);
      if (operators.length > 1) {
        throw new Error(
          'Inside filter statement should be only one condition operator for each attribute',
        );
      }
      // eslint-disable-next-line no-restricted-syntax
      for (const [innerKey, innerValue] of operators) {
        const operatorKey = innerKey.replace(FILTER_OPERATION_PREFIX, '');
        if (extendedParams.has(key)) {
          const field = extendedParams.get(key);
          // eslint-disable-next-line no-nested-ternary
          const rightExpression = field.sqlExp
            ? field.sqlExp
            : sqlAlias
            ? `${sqlAlias}.${field.name}`
            : field.name;
          typeormWhereQuery.push(
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            buildSqlArgument(operatorKey, rightExpression, innerValue),
          );
        } else {
          const rightExpression = sqlAlias ? `${sqlAlias}.${key}` : key;
          typeormWhereQuery.push(
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            buildSqlArgument(operatorKey, rightExpression, innerValue),
          );
        }
      }
    }
  }
  return typeormWhereQuery;
};

const buildSqlArgument = (operatorKey: string, field: string, value: any) => {
  let result = [];
  const argName = `arg_${convertArrayOfStringIntoStringNumber([
    Math.random().toString(36).slice(2),
    operatorKey,
    field,
    value,
  ])}`;

  switch (operatorKey) {
    case OperationQuery.eq:
      if (value === null) {
        result = [`${field} is null`];
      } else {
        result = [`${field} = :${argName}`, { [argName]: value }];
      }
      break;
    case OperationQuery.ne:
      if (value !== null) {
        result = [`${field} != :${argName}`, { [argName]: value }];
      } else {
        result = [`${field} is not null`];
      }
      break;
    case OperationQuery.lt:
      result = [`${field} < :${argName}`, { [argName]: value }];
      break;
    case OperationQuery.lte:
      result = [`${field} <= :${argName}`, { [argName]: value }];
      break;
    case OperationQuery.gt:
      result = [`${field} > :${argName}`, { [argName]: value }];
      break;
    case OperationQuery.gte:
      result = [`${field} >= :${argName}`, { [argName]: value }];
      break;
    case OperationQuery.like:
      result = [`${field} like :${argName}`, { [argName]: value }];
      break;
    case OperationQuery.notLike:
      result = [`${field} not like :${argName}`, { [argName]: value }];
      break;
    case OperationQuery.regexp:
      result = [`${field} regexp :${argName}`, { [argName]: value }];
      break;
    case OperationQuery.between:
      result = [
        `${field} between :${argName}1 and :${argName}2`,
        {
          [`${argName}1`]: value[0],
          [`${argName}2`]: value[1],
        },
      ];
      break;
    case OperationQuery.notBetween:
      result = [
        `${field} not between :${argName}1 and :${argName}2`,
        {
          [`${argName}1`]: value[0],
          [`${argName}2`]: value[1],
        },
      ];
      break;
    case OperationQuery.in:
      result = [`${field} in (:...${argName})`, { [argName]: value }];
      break;
    case OperationQuery.notIn:
      result = [`${field} not in (:...${argName})`, { [argName]: value }];
      break;
    case OperationQuery.any:
      result = [`${field} any (:${argName})`, { [argName]: value }];
      break;
    case OperationQuery.null:
      if (value === 'true' || value === true) {
        result = [`${field} is null`];
      } else {
        result = [`${field} is not null`];
      }
      break;
    default:
  }
  return result;
};
