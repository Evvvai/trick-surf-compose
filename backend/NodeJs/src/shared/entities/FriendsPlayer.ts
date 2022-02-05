import { ObjectType, Field } from '@nestjs/graphql';
import { Players } from 'src/shared/entities/Players';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Index('FK_friend_player_player', ['playerId'], {})
@Index('FK_friend_player_friend', ['friendId'], {})
@Entity({ name: 'friends_player' })
export class FriendsPlayer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Field({ nullable: false })
  playerId: number;

  @Column()
  @Field({ nullable: false })
  friendId: number;

  @CreateDateColumn({
    name: 'since',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  @Field({ nullable: false })
  since: Date;

  /////////////////////////////////////////////////////////////////////////////////
  // Relations

  @ManyToOne(() => Players, (player) => player.friend1, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'playerId', referencedColumnName: 'id' }])
  player1: Players;

  @ManyToOne(() => Players, (player) => player.friend2, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'friendId', referencedColumnName: 'id' }])
  player2: Players;
}
