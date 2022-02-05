import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@Entity('leaderboard_cached')
@ObjectType()
export class LeaderboardCached {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  @Field(() => Int)
  id: number;

  @Column('int', { name: 'player_id' })
  @Field(() => Int, { name: 'playerId' })
  playerId: number;

  @Column('varchar', { name: 'steamid64' })
  @Field(() => String)
  steamid64: string;

  @Column('varchar', { name: 'nick' })
  @Field(() => String)
  nick: string;

  @Column('int', { name: 'ac_place' })
  @Field(() => Int, { name: 'acPlace' })
  acPlace: number;

  @Column('int', { name: 'ac' })
  @Field(() => Int)
  ac: number;

  @Column('int', { name: 'ap_place' })
  @Field(() => Int, { name: 'apPlace' })
  apPlace: number;

  @Column('int', { name: 'ap' })
  @Field(() => Int)
  ap: number;

  @Column('int', { name: 'up_place' })
  @Field(() => Int, { name: 'upPlace' })
  upPlace: number;

  @Column('int', { name: 'up' })
  @Field(() => Int)
  up: number;

  @Column('int', { name: 'uc_place' })
  @Field(() => Int, { name: 'ucPlace' })
  ucPlace: number;

  @Column('int', { name: 'uc' })
  @Field(() => Int)
  uc: number;

  @Column('varchar', { name: 'avg' })
  @Field(() => String)
  avg: string;

  @Column('int', { name: 'place' })
  @Field(() => Int)
  place: number;

  @Column('varchar', { name: 'completes_percent' })
  @Field(() => Float, { name: 'completesPercent' })
  completesPercent: number;

  @Column('int', { name: 'map_id' })
  @Field(() => Int, { name: 'mapId' })
  mapId: number;

  /////////////////////////////////////////////////////////////////////////////////
  // Relations
}
