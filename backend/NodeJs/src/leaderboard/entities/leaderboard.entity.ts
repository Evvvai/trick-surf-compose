import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Leaderboard {
  @Field(() => Int, { name: 'playerId' })
  player_id: number;

  @Field(() => String)
  steamid64: string;

  @Field(() => String)
  nick: string;

  @Field(() => String, { name: 'acPlace', nullable: true })
  ac_place: string;

  @Field(() => Int)
  ac: number;

  @Field(() => Int, { name: 'apPlace', nullable: true })
  ap_place: number;

  @Field(() => Int)
  ap: number;

  @Field(() => Int, { name: 'upPlace', nullable: true })
  up_place: number;

  @Field(() => Int)
  up: number;

  @Field(() => Int, { name: 'ucPlace', nullable: true })
  uc_place: number;

  @Field(() => Int)
  uc: number;

  @Field(() => String)
  avg: string;

  @Field(() => Int)
  place: number;

  @Field(() => String, { name: 'completesPercent', nullable: true })
  completes_percent: string;
}
