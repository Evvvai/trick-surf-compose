import { Field, ObjectType } from '@nestjs/graphql';
import { Players } from 'src/shared/entities/Players';

@ObjectType()
export class PlayerToken {
  @Field()
  token: string;

  @Field()
  player: Players;
}
