import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Players } from './Players';

@Index('player_id', ['playerId'], {})
@Entity('time_online')
export class TimeOnline {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'player_id', nullable: true })
  playerId: number | null;

  @Column('time', { name: 'time', nullable: true })
  time: string | null;

  @Column('timestamp', { name: 'time_join', nullable: true })
  timeJoin: Date | null;

  @Column('timestamp', { name: 'time_left', nullable: true })
  timeLeft: Date | null;

  @ManyToOne(() => Players, (players) => players.timeOnlines, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'player_id', referencedColumnName: 'id' }])
  player: Players;
}
