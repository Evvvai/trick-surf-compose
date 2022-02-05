import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SuggestedRoutes } from './SuggestedRoutes';
import { Maps } from './Maps';
import { Players } from './Players';
import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { SuggestedTricksRates } from './SuggestedTricksRate';

export enum Status {
  pending = 'pending',
  accepted = 'accepted',
  declined = 'declined',
}

registerEnumType(Status, {
  name: 'Status',
});

@Index('name', ['name'], { unique: true })
@Index('author_id', ['authorId'], {})
@Index('map_id', ['mapId'], {})
@Entity('suggested_tricks')
@ObjectType()
export class SuggestedTricks {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  @Field(() => Int)
  id: number;

  @Column('varchar', {
    name: 'name',
    nullable: false,
    unique: true,
    length: 50,
  })
  @Field()
  name: string | null;

  @Column('int', { name: 'point', nullable: false })
  @Field(() => Int)
  point: number | null;

  @Column('int', { name: 'velocity', nullable: false })
  @Field(() => Int)
  velocity: number | null;

  @Column('timestamp', {
    name: 'date_add',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  @Field(() => Date)
  dateAdd: Date | null;

  @Column('timestamp', {
    name: 'date_modify',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  @Field(() => Date)
  dateModify: Date | null;

  @Column('enum', {
    name: 'status',
    nullable: false,
    enum: Status,
    default: Status.pending,
  })
  @Field(() => Status, { nullable: false })
  status: Status;

  @Column('int', { name: 'author_id' })
  @Field(() => Int, { nullable: false })
  authorId: number;

  @Column('int', { name: 'map_id' })
  @Field(() => Int)
  mapId: number;

  /////////////////////////////////////////////////////////////////////////////////
  // Relations

  @OneToMany(() => SuggestedRoutes, (suggestedRoutes) => suggestedRoutes.trick)
  suggestedRoutes: SuggestedRoutes[];

  @OneToMany(
    () => SuggestedTricksRates,
    (suggestedTricksRate) => suggestedTricksRate.trick,
  )
  rates: SuggestedTricksRates[];

  @ManyToOne(() => Maps, (maps) => maps.suggestedTricks, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'map_id', referencedColumnName: 'id' }])
  map: Maps;

  @ManyToOne(() => Players, (players) => players.suggestedTricks, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'author_id', referencedColumnName: 'id' }])
  author: Players;
}
