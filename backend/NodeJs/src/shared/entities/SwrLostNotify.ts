import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Players } from './Players';
import { SwrUpdate } from './SwrUpdate';
import { TwrUpdate } from './TwrUpdate';

@Index('wr_id', ['wrId'], {})
@Index('player_id', ['playerId'], {})
@Entity('swr_lost_notify')
export class SwrLostNotify {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { name: 'wr_id' })
  wrId: number;

  @Column('int', { name: 'player_id' })
  playerId: number;

  @Column('tinyint', { name: 'is_checked', default: () => 0 })
  isChecked: number;

  /////////////////////////////////////////////////////////////////////////////////
  // Relations

  @OneToOne(() => SwrUpdate, (swrUpdate) => swrUpdate.swrLostNotify, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'wr_id', referencedColumnName: 'id' }])
  swrUpdate: TwrUpdate;

  @ManyToOne(() => Players, (players) => players.swrLostNotify, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'player_id', referencedColumnName: 'id' }])
  player: Players;
}
