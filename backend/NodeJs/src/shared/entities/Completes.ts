import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Players } from './Players';
import { Tricks } from './Tricks';
import { Swr } from './Swr';
import { SwrUpdate } from './SwrUpdate';
import { TriggersTimeSpeedRoutes } from './TriggersTimeSpeedRoutes';
import { TriggersTimeSpeedTouch } from './TriggersTimeSpeedTouch';
import { Twr } from './Twr';
import { TwrUpdate } from './TwrUpdate';
import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@Index('player_id', ['playerId'], {})
@Index('trick_id', ['trickId'], {})
@Entity('completes')
@ObjectType()
export class Completes {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  @Field(() => Int)
  id: number;

  @Column('int', { name: 'player_id', nullable: true })
  @Field(() => Int)
  playerId: number | null;

  @Column('int', { name: 'trick_id', nullable: true })
  @Field(() => Int)
  trickId: number | null;

  @Column('smallint', { name: 'speed', nullable: true })
  @Field(() => Int)
  speed: number | null;

  @Column('float', { name: 'time', nullable: true, precision: 12 })
  @Field(() => Float)
  time: number | null;

  @Column('timestamp', {
    name: 'date_add',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  @Field(() => Date)
  dateAdd: Date | null;

  /////////////////////////////////////////////////////////////////////////////////
  // Relations

  @ManyToOne(() => Players, (players) => players.completes, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'player_id', referencedColumnName: 'id' }])
  player: Players;

  @ManyToOne(() => Tricks, (tricks) => tricks.completes, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'trick_id', referencedColumnName: 'id' }])
  trick: Tricks;

  @OneToMany(() => Swr, (swr) => swr.complete)
  swrs: Swr[];

  @OneToMany(() => SwrUpdate, (swrUpdate) => swrUpdate.nowWr2)
  swrUpdates: SwrUpdate[];

  @OneToMany(() => SwrUpdate, (swrUpdate) => swrUpdate.beforeWr2)
  swrUpdates2: SwrUpdate[];

  @OneToMany(
    () => TriggersTimeSpeedRoutes,
    (triggersTimeSpeedRoutes) => triggersTimeSpeedRoutes.complete,
  )
  triggersTimeSpeedRoutes: TriggersTimeSpeedRoutes[];

  @OneToMany(
    () => TriggersTimeSpeedTouch,
    (triggersTimeSpeedTouch) => triggersTimeSpeedTouch.complete,
  )
  triggersTimeSpeedTouches: TriggersTimeSpeedTouch[];

  @OneToMany(() => Twr, (twr) => twr.complete)
  twrs: Twr[];

  @OneToMany(() => TwrUpdate, (twrUpdate) => twrUpdate.nowWr2)
  twrUpdates: TwrUpdate[];

  @OneToMany(() => TwrUpdate, (twrUpdate) => twrUpdate.beforeWr2)
  twrUpdates2: TwrUpdate[];
}
