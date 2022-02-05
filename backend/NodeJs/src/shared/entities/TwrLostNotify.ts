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
import { TwrUpdate } from './TwrUpdate';

@Index('wr_id', ['wrId'], {})
@Index('player_id', ['playerId'], {})
@Entity('twr_lost_notify')
export class TwrLostNotify {
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

  @OneToOne(() => TwrUpdate, (twrUpdate) => twrUpdate.twrLostNotify, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'wr_id', referencedColumnName: 'id' }])
  twrUpdate: TwrUpdate;

  @ManyToOne(() => Players, (players) => players.twrLostNotify, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'player_id', referencedColumnName: 'id' }])
  player: Players;
}
