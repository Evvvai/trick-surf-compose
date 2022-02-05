import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Completes } from './Completes';

@Index('complete_id', ['completeId'], {})
@Entity('triggers_time_speed_routes')
export class TriggersTimeSpeedRoutes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { name: 'complete_id', nullable: true })
  completeId: number | null;

  @Column('int', { name: 'index', nullable: true })
  index: number | null;

  @Column('varchar', { name: 'route_ids', nullable: true, length: 255 })
  routeIds: string | null;

  @Column('float', { name: 'summary_time', nullable: true, precision: 12 })
  summaryTime: number | null;

  @ManyToOne(
    () => Completes,
    (completes) => completes.triggersTimeSpeedRoutes,
    { onDelete: 'CASCADE', onUpdate: 'NO ACTION' },
  )
  @JoinColumn([{ name: 'complete_id', referencedColumnName: 'id' }])
  complete: Completes;
}
