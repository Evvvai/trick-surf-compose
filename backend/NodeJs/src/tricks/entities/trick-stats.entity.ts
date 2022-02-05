import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TricksStats {
  @Field(() => Int)
  index: number;

  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field(() => Int)
  point: number;

  @Field(() => Int)
  velocity: number;

  @Field(() => Date, { name: 'dateAdd' })
  date_add: Date;

  @Field(() => String, { name: 'routeIds' })
  route_id: string;

  @Field(() => Int, { nullable: true })
  len: number | null;

  @Field(() => String, { nullable: true, name: 'authorSteamid' })
  author_steamid: string | null;

  @Field(() => Int, { nullable: true })
  completes: number | null;

  @Field(() => Int, { nullable: true, name: 'myCompletes' })
  my_completes: number | null;
}
