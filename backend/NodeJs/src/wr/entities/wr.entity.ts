import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Completes } from 'src/shared/entities/Completes';

@ObjectType()
export class WR extends Completes {}
