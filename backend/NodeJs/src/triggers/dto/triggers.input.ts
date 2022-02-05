import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class TriggersInput {
  @Field(() => Int, { description: 'Map id' })
  mapId: number;
}
