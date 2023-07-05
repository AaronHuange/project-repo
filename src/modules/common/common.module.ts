import { Module } from '@nestjs/common';
import { DateScalar } from '@/modules/common/scalars/date.scalar';
import { JSONScalar } from '@/modules/common/scalars/json.scalar';
import { JsonObjectScalar } from '@/modules/common/scalars/json_object.scalar';

@Module({
  providers: [DateScalar, JSONScalar, JsonObjectScalar],
})
export class CommonModule {}
