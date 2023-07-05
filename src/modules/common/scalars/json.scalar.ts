/* eslint-disable class-methods-use-this */
import { CustomScalar, Scalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

@Scalar('JSON', () => JSON)
export class JSONScalar implements CustomScalar<string, JSON> {
  description = 'JSON custom scalar type';

  parseValue(value: string): JSON {
    return JSON.parse(value); // value from the client
  }

  serialize(value: JSON): string {
    return JSON.stringify(value);
  }

  parseLiteral(ast: ValueNode): JSON {
    if (ast.kind === Kind.STRING) {
      return JSON.parse(ast.value);
    }
    return null;
  }
}
