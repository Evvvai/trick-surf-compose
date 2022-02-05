import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SuggestedTricks } from './SuggestedTricks';
import { Tricks } from './Tricks';
import { Triggers } from './Triggers';

@Index('name', ['name'], { unique: true })
@Entity('maps')
@ObjectType()
export class Maps {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  @Field(() => Int)
  id: number;

  @Column('varchar', {
    name: 'name',
    nullable: false,
    unique: true,
    length: 50,
  })
  @Field(() => String)
  name: string;

  @Column({ type: 'text', nullable: true, name: 'alternative_name' })
  @Field({ nullable: true })
  alternativeName: string | null;

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true })
  src: string | null;

  @Column('timestamp', {
    name: 'date_created',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  @Field(() => Date)
  dateCreated: Date;

  /////////////////////////////////////////////////////////////////////////////////
  // Relations

  @OneToMany(() => SuggestedTricks, (suggestedTricks) => suggestedTricks.map)
  suggestedTricks: SuggestedTricks[];

  @OneToMany(() => Tricks, (tricks) => tricks.map)
  tricks: Tricks[];

  @OneToMany(() => Triggers, (triggers) => triggers.map)
  triggers: Triggers[];
}
