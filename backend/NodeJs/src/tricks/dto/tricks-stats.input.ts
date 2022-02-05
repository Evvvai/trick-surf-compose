import { InputType, Field } from '@nestjs/graphql';
import { TricksInput } from './tricks.input';

@InputType()
export class TricksStatsInput extends TricksInput {
  @Field(() => String, { description: 'User steamd', nullable: true })
  steamid: string | null;
}
