import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Completes } from './Completes';
import { TwrLostNotify } from './TwrLostNotify';

@Index('now_wr', ['nowWr'], {})
@Index('before_wr', ['beforeWr'], {})
@Entity('twr_update')
export class TwrUpdate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { name: 'now_wr', nullable: true })
  nowWr: number | null;

  @Column('int', { name: 'before_wr', nullable: true })
  beforeWr: number | null;

  /////////////////////////////////////////////////////////////////////////////////
  // Relations

  @OneToOne(() => TwrLostNotify, (twrLostNotify) => twrLostNotify.twrUpdate)
  twrLostNotify: TwrLostNotify;

  @ManyToOne(() => Completes, (completes) => completes.twrUpdates, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'now_wr', referencedColumnName: 'id' }])
  nowWr2: Completes;

  @ManyToOne(() => Completes, (completes) => completes.twrUpdates2, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'before_wr', referencedColumnName: 'id' }])
  beforeWr2: Completes;
}
