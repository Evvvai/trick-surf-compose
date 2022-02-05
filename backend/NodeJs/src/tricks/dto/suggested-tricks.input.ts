import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class SuggestedTricksInput {
  @Field(() => Int, { description: 'Map id' })
  mapId: number;

  @Field(() => Int, { description: 'Limit', nullable: true })
  limit: number;

  @Field(() => Int, { description: 'Offset', nullable: true })
  offset: number;
}
