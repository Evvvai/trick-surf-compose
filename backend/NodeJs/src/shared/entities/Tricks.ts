import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Completes } from './Completes';
import { Routes } from './Routes';
import { Swr } from './Swr';
import { Players } from './Players';
import { Twr } from './Twr';
import { Maps } from './Maps';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@Index('author_id', ['authorId'], {})
@Index('map_id', ['mapId'], {})
@Entity('tricks')
@ObjectType()
export class Tricks {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  @Field(() => Int)
  id: number;

  @Column('varchar', { name: 'name', nullable: false, length: 255 })
  @Field()
  name: string;

  @Column('smallint', { name: 'point', nullable: false })
  @Field(() => Int)
  point: number;

  @Column('tinyint', { name: 'velocity', nullable: false })
  @Field(() => Int)
  velocity: number;

  @Column('timestamp', {
    name: 'date_add',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  @Field(() => Date)
  dateAdd: Date;

  @Column('int', { name: 'author_id', nullable: false })
  @Field(() => Int, { nullable: false })
  authorId: number | null;

  @Column('int', { name: 'map_id', nullable: false, default: () => "'0'" })
  @Field(() => Int)
  mapId: number;

  /////////////////////////////////////////////////////////////////////////////////
  // Relations

  @OneToMany(() => Completes, (completes) => completes.trick)
  completes: Completes[];

  @OneToMany(() => Routes, (routes) => routes.trick)
  routes: Routes[];

  @OneToMany(() => Swr, (swr) => swr.trick)
  swrs: Swr[];

  @ManyToOne(() => Players, (players) => players.tricks, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'author_id', referencedColumnName: 'id' }])
  author: Players;

  @OneToMany(() => Twr, (twr) => twr.trick)
  twrs: Twr[];

  @ManyToOne(() => Maps, (maps) => maps.tricks, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'map_id', referencedColumnName: 'id' }])
  map: Maps;
}
