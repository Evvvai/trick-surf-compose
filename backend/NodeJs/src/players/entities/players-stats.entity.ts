import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PlayersStats {
  @Field(() => Int, { name: 'acPlace', nullable: true })
  ac_place: number;

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

  @Field(() => Float)
  avg: number;

  @Field(() => Int)
  place: number;

  @Field(() => Float, { name: 'completesPercent', nullable: true })
  completes_percent: number;

  @Field(() => Int, { name: 'tricksPoints', nullable: true })
  tricks_points: number;

  @Field(() => Int, { name: 'tricksCounts', nullable: true })
  tricks_counts: number;

  @Field(() => Int, { name: 'twrCounts', nullable: true })
  twr_counts: number;

  @Field(() => Int, { name: 'swrCounts', nullable: true })
  swr_counts: number;

  @Field(() => Int, { name: 'tricksCreated', nullable: true })
  tricks_created: number;
}
