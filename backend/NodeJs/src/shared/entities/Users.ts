import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'steamid64', nullable: true, length: 255 })
  steamid64: string | null;

  @Column('varchar', { name: 'username', nullable: true, length: 255 })
  username: string | null;

  @Column('varchar', { name: 'profileurl', nullable: true, length: 255 })
  profileurl: string | null;

  @Column('varchar', { name: 'avatarfull', nullable: true, length: 255 })
  avatarfull: string | null;

  @Column('varchar', { name: 'avatarCustom', nullable: true, length: 255 })
  avatarCustom: string | null;

  @Column('varchar', { name: 'dashboard', nullable: true, length: 255 })
  dashboard: string | null;

  @Column('varchar', { name: 'role', nullable: true, length: 255 })
  role: string | null;

  @Column('timestamp', {
    name: 'date_reg',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  dateReg: Date | null;

  @Column('timestamp', {
    name: 'last_login',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  lastLogin: Date | null;
}
