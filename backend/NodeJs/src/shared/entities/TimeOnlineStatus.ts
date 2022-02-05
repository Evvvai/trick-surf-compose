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
@Entity('time_online_status')
export class TimeOnlineStatus {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'player_id', nullable: true })
  playerId: number | null;

  @Column('int', { name: 'status', nullable: true, default: () => "'0'" })
  status: number | null;

  @Column('timestamp', {
    name: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  timestamp: Date | null;

  @ManyToOne(() => Players, (players) => players.timeOnlineStatuses, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'player_id', referencedColumnName: 'id' }])
  player: Players;
}
