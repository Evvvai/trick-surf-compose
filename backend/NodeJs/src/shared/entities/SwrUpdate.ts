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
import { SwrLostNotify } from './SwrLostNotify';

@Index('now_wr', ['nowWr'], {})
@Index('before_wr', ['beforeWr'], {})
@Entity('swr_update')
export class SwrUpdate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { name: 'now_wr', nullable: true })
  nowWr: number | null;

  @Column('int', { name: 'before_wr', nullable: true })
  beforeWr: number | null;

  /////////////////////////////////////////////////////////////////////////////////
  // Relations

  @OneToOne(() => SwrLostNotify, (swrLostNotify) => swrLostNotify.swrUpdate)
  swrLostNotify: SwrLostNotify;

  @ManyToOne(() => Completes, (completes) => completes.swrUpdates, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'now_wr', referencedColumnName: 'id' }])
  nowWr2: Completes;

  @ManyToOne(() => Completes, (completes) => completes.swrUpdates2, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'before_wr', referencedColumnName: 'id' }])
  beforeWr2: Completes;
}
