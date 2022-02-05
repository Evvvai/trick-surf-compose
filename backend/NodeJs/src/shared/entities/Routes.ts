import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tricks } from './Tricks';
import { Triggers } from './Triggers';

@Index('trick_id', ['trickId'], {})
@Index('trigger_id', ['triggerId'], {})
@Entity('routes')
@ObjectType()
export class Routes {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  @Field(() => Int)
  id: number;

  @Column('int', { name: 'trick_id', nullable: true })
  @Field(() => Int)
  trickId: number | null;

  @Column('int', { name: 'trigger_id', nullable: true })
  @Field(() => Int)
  triggerId: number | null;

  /////////////////////////////////////////////////////////////////////////////////
  // Relations

  @ManyToOne(() => Tricks, (tricks) => tricks.routes, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'trick_id', referencedColumnName: 'id' }])
  trick: Tricks;

  @ManyToOne(() => Triggers, (triggers) => triggers.routes, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'trigger_id', referencedColumnName: 'id' }])
  trigger: Triggers;
}
