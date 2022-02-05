import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class TricksInput {
  @Field(() => Int, { description: 'Map id' })
  mapId: number;
}
