// @ts-ignore
import { CustomScalar, Scalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

/** 这个有缺陷，暂时使用json_object代替 **/
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
