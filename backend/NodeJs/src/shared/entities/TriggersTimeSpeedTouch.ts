import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Completes } from './Completes';
import { Triggers } from './Triggers';

@Index('complete_id', ['completeId'], {})
@Index('trigger_before_id', ['triggerBeforeId'], {})
@Index('trigger_id', ['triggerId'], {})
@Entity('triggers_time_speed_touch')
export class TriggersTimeSpeedTouch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { name: 'complete_id', nullable: true })
  completeId: number | null;

  @Column('int', { name: 'trigger_before_id', nullable: true })
  triggerBeforeId: number | null;

  @Column('int', { name: 'trigger_id', nullable: true })
  triggerId: number | null;

  @Column('int', { name: 'speed_start', nullable: true })
  speedStart: number | null;

  @Column('int', { name: 'speed_end', nullable: true })
  speedEnd: number | null;

  @Column('int', { name: 'speed_before_max', nullable: true })
  speedBeforeMax: number | null;

  @Column('int', { name: 'speed_during_max', nullable: true })
  speedDuringMax: number | null;

  @Column('float', { name: 'time_before', nullable: true, precision: 12 })
  timeBefore: number | null;

  @Column('float', { name: 'time_during', nullable: true, precision: 12 })
  timeDuring: number | null;

  @ManyToOne(
    () => Completes,
    (completes) => completes.triggersTimeSpeedTouches,
    { onDelete: 'CASCADE', onUpdate: 'NO ACTION' },
  )
  @JoinColumn([{ name: 'complete_id', referencedColumnName: 'id' }])
  complete: Completes;

  @ManyToOne(() => Triggers, (triggers) => triggers.triggersTimeSpeedTouches, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'trigger_before_id', referencedColumnName: 'id' }])
  triggerBefore: Triggers;

  @ManyToOne(() => Triggers, (triggers) => triggers.triggersTimeSpeedTouches2, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'trigger_id', referencedColumnName: 'id' }])
  trigger: Triggers;
}
