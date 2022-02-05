import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AuthInput {
  @Field()
  jwt: string;
}
