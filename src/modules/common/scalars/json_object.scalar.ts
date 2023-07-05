/* eslint-disable class-methods-use-this */
// eslint-disable-next-line max-classes-per-file
import { CustomScalar, Scalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

// @ObjectType()
// export class JsonObject extends Object {}

@Scalar('JsonObject', () => Object)
export class JsonObjectScalar implements CustomScalar<any, any> {
  description = 'JSON custom scalar type';

  parseValue(value: any): any {
    return value; // value from the client
  }

  serialize(value: any): any {
    return value;
  }

  parseLiteral(ast: ValueNode): object | string | any {
    if (ast.kind === Kind.STRING) {
      return ast.value;
    }
    return null;
  }
}
