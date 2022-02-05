import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Maps } from './Maps';
import { Players } from './Players';
import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { SuggestedTricks } from './SuggestedTricks';

export enum Rate {
  up = 'up',
  down = 'down',
}

registerEnumType(Rate, {
  name: 'Rate',
});

@Index('trick_id', ['playerId'], {})
@Index('player_id', ['trickId'], {})
@Entity('suggested_tricks_rates')
@ObjectType()
export class SuggestedTricksRates {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  @Field(() => Int)
  id: number;

  @Column('int', { name: 'trick_id' })
  @Field(() => Int)
  trickId: number;

  @Column('int', { name: 'player_id' })
  @Field(() => Int, { nullable: false })
  playerId: number;

  @Column('enum', {
    name: 'rate',
    nullable: false,
    enum: Rate,
  })
  @Field(() => Rate, { nullable: false })
  rate: Rate;

  @Column('timestamp', {
    name: 'date_add',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  @Field(() => Date)
  dateAdd: Date;

  /////////////////////////////////////////////////////////////////////////////////
  // Relations

  @ManyToOne(
    () => SuggestedTricks,
    (suggestedTricks) => suggestedTricks.rates,
    {
      onDelete: 'CASCADE',
      onUpdate: 'NO ACTION',
    },
  )
  @JoinColumn([{ name: 'trick_id', referencedColumnName: 'id' }])
  trick: Maps;

  @ManyToOne(() => Players, (players) => players.rates, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'player_id', referencedColumnName: 'id' }])
  player: Players;
}
