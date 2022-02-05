import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SuggestedTricks } from './SuggestedTricks';
import { Triggers } from './Triggers';

@Index('trigger_id', ['triggerId'], {})
@Index('trick_id', ['trickId'], {})
@Entity('suggested_routes')
export class SuggestedRoutes {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'trick_id', nullable: true })
  trickId: number | null;

  @Column('int', { name: 'trigger_id', nullable: true })
  triggerId: number | null;

  @ManyToOne(
    () => SuggestedTricks,
    (suggestedTricks) => suggestedTricks.suggestedRoutes,
    { onDelete: 'CASCADE', onUpdate: 'NO ACTION' },
  )
  @JoinColumn([{ name: 'trick_id', referencedColumnName: 'id' }])
  trick: SuggestedTricks;

  @ManyToOne(() => Triggers, (triggers) => triggers.suggestedRoutes, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'trigger_id', referencedColumnName: 'id' }])
  trigger: Triggers;
}
