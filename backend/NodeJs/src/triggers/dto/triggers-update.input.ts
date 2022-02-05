import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class TriggersUpdateInput {
  @Field(() => String)
  src: string;

  @Field(() => String)
  name: string;

  @Field(() => Int)
  id: number;
}
