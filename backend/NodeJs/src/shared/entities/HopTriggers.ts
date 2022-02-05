import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Triggers } from './Triggers';

@Index('trick_id', ['triggerId'], {})
@Entity('hop_triggers')
export class HopTriggers {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'trigger_id', nullable: true })
  triggerId: number | null;

  @ManyToOne(() => Triggers, (triggers) => triggers.hopTriggers, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'trigger_id', referencedColumnName: 'id' }])
  trigger: Triggers;
}
