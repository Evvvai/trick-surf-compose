import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Completes } from './Completes';
import { Tricks } from './Tricks';

@Index('trick_id', ['trickId'], {})
@Index('complete_id', ['completeId'], {})
@Entity('twr')
export class Twr {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { name: 'trick_id', nullable: true })
  trickId: number | null;

  @Column('int', { name: 'complete_id', nullable: true })
  completeId: number | null;

  @ManyToOne(() => Completes, (completes) => completes.twrs, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'complete_id', referencedColumnName: 'id' }])
  complete: Completes;

  @ManyToOne(() => Tricks, (tricks) => tricks.twrs, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'trick_id', referencedColumnName: 'id' }])
  trick: Tricks;
}
