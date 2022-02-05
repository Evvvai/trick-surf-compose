import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Completes } from './Completes';
import { Tricks } from './Tricks';
import { SuggestedTricks } from './SuggestedTricks';
import { TimeOnline } from './TimeOnline';
import { TimeOnlineStatus } from './TimeOnlineStatus';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Role } from 'src/players/entities/role.enum';
import { FriendsPlayer } from './FriendsPlayer';
import { SuggestedTricksRates } from './SuggestedTricksRate';
import { TwrLostNotify } from './TwrLostNotify';
import { SwrLostNotify } from './SwrLostNotify';

@Index('steamid', ['steamid'], { unique: true })
@Index('steamid64', ['steamid64'], { unique: true })
@Entity('players')
@ObjectType()
export class Players {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  @Field(() => Int)
  id: number;

  @Column('varchar', {
    name: 'steamid',
    nullable: true,
    unique: true,
    length: 255,
  })
  @Field(() => String)
  steamid: string | null;

  @Column('varchar', {
    name: 'steamid64',
    nullable: true,
    unique: true,
    length: 255,
  })
  @Field(() => String)
  steamid64: string | null;

  @Column('varchar', { name: 'nick', nullable: false })
  @Field(() => String)
  nick: string;

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true })
  profileurl: string;

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true })
  avatarfull: string;

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true })
  avatarCustom: string;

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true })
  dashboard: string;

  @Column('timestamp', {
    name: 'date_joined',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  @Field(() => Date)
  dateJoined: Date | null;

  @CreateDateColumn({
    name: 'last_login_site',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  @Field({ nullable: true })
  lastLoginSite: Date;

  @CreateDateColumn({
    name: 'last_login_server',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  @Field({ nullable: true })
  lastLoginServer: Date;

  @Column({ type: 'enum', enum: Role, default: Role.PLAYER })
  @Field({ nullable: true })
  role: Role;

  /////////////////////////////////////////////////////////////////////////////////
  // Relations

  @OneToMany(() => FriendsPlayer, (friendsUser) => friendsUser.player1)
  friend1: FriendsPlayer[];

  @OneToMany(() => FriendsPlayer, (friendsUser) => friendsUser.player2)
  friend2: FriendsPlayer[];

  @OneToMany(() => Completes, (completes) => completes.player)
  completes: Completes[];

  @OneToMany(() => Tricks, (tricks) => tricks.author)
  tricks: Tricks[];

  @OneToMany(() => SuggestedTricks, (suggestedTricks) => suggestedTricks.author)
  suggestedTricks: SuggestedTricks[];

  @OneToMany(() => TimeOnline, (timeOnline) => timeOnline.player)
  timeOnlines: TimeOnline[];

  @OneToMany(
    () => SuggestedTricksRates,
    (suggestedTricksRate) => suggestedTricksRate.player,
  )
  rates: SuggestedTricksRates[];

  @OneToMany(
    () => TimeOnlineStatus,
    (timeOnlineStatus) => timeOnlineStatus.player,
  )
  timeOnlineStatuses: TimeOnlineStatus[];

  @OneToMany(() => TwrLostNotify, (twrLostNotify) => twrLostNotify.player)
  twrLostNotify: TwrLostNotify[];

  @OneToMany(() => SwrLostNotify, (swrLostNotify) => swrLostNotify.player)
  swrLostNotify: SwrLostNotify[];
}
