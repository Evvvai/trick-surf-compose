import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SuggestedTrickRate {
  @Field(() => Int)
  up: number;

  @Field(() => Int)
  down: number;
}
