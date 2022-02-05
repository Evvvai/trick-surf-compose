import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, MaxLength, IsNumber, MinLength } from 'class-validator';
import { IsTrickNameValid } from '../decorators/valid-trick-name.decorator';

@InputType()
export class SendTrickInput {
  @Field(() => String, { description: 'Name trick' })
  // @MaxLength(32)
  // @MinLength(4)
  @IsTrickNameValid()
  name: string;

  @Field(() => Int, { description: 'Points for trick' })
  @IsNotEmpty()
  @IsNumber()
  point: number;

  @Field(() => Int, { description: 'Velocity prestrafe /u nlimited' })
  velocity: number;

  @Field(() => String, {
    description: 'Route for trick "trigger_id,trigger_id"',
  })
  @IsNotEmpty()
  route: string;

  @Field(() => Int, { description: 'Author id' })
  @IsNotEmpty()
  authorId: number;

  @Field(() => Int, { description: 'Map id' })
  @IsNotEmpty()
  mapId: number;
}
