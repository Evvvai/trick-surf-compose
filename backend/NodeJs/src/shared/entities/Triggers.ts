import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { HopTriggers } from './HopTriggers';
import { Routes } from './Routes';
import { TriggersTimeSpeedTouch } from './TriggersTimeSpeedTouch';
import { SuggestedRoutes } from './SuggestedRoutes';
import { Maps } from './Maps';
import { Field, Int, ObjectType } from '@nestjs/graphql';

// @Index('name', ['name'], { unique: true })
@Index('map_id', ['mapId'], {})
@Entity('triggers')
@ObjectType()
export class Triggers {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  @Field(() => Int)
  id: number;

  // @Column()
  @PrimaryColumn('varchar', {
    name: 'name',
    unique: true,
    length: 255,
  })
  @Field(() => String, { nullable: true })
  name: string | null;

  @Column('varchar', { name: 'alternative_name', nullable: true, length: 255 })
  @Field(() => String, { nullable: true })
  alternativeName: string | null;

  @Column('text', { name: 'src', nullable: true })
  @Field(() => String, { nullable: true })
  src: string;

  @Column('float', { name: 'x', nullable: true, precision: 12 })
  @Field(() => Int, { nullable: true })
  x: number | null;

  @Column('float', { name: 'y', nullable: true, precision: 12 })
  @Field(() => Int, { nullable: true })
  y: number | null;

  @Column('float', { name: 'z', nullable: true, precision: 12 })
  @Field(() => Int, { nullable: true })
  z: number | null;

  // @Column()
  @PrimaryColumn('int', {
    name: 'map_id',
    nullable: false,
    default: () => "'0'",
  })
  @Field(() => Int, { nullable: false })
  mapId: number;

  /////////////////////////////////////////////////////////////////////////////////
  // Relations

  @OneToMany(() => HopTriggers, (hopTriggers) => hopTriggers.trigger)
  hopTriggers: HopTriggers[];

  @OneToMany(() => Routes, (routes) => routes.trigger)
  routes: Routes[];

  @OneToMany(
    () => TriggersTimeSpeedTouch,
    (triggersTimeSpeedTouch) => triggersTimeSpeedTouch.triggerBefore,
  )
  triggersTimeSpeedTouches: TriggersTimeSpeedTouch[];

  @OneToMany(
    () => TriggersTimeSpeedTouch,
    (triggersTimeSpeedTouch) => triggersTimeSpeedTouch.trigger,
  )
  triggersTimeSpeedTouches2: TriggersTimeSpeedTouch[];

  @OneToMany(
    () => SuggestedRoutes,
    (suggestedRoutes) => suggestedRoutes.trigger,
  )
  suggestedRoutes: SuggestedRoutes[];

  @ManyToOne(() => Maps, (maps) => maps.triggers, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'map_id', referencedColumnName: 'id' }])
  map: Maps;
}
