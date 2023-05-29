import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum AdminStatus {
  Waiting_for_approval = 'WAITING_FOR_APPROVAL',
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Rejected = 'REJECTED',
}

@Entity({ name: 'admins_profile' })
export class AdminsDocument {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ type: 'varchar', nullable: true })
  name?: string;

  @Column({ type: 'varchar', nullable: true })
  email?: string;

  @Column()
  password?: string;

  @Column({ nullable: true })
  token_reset_password: string;

  @Column({ type: 'varchar', nullable: true })
  phone?: string;

  @Column({ type: 'varchar', nullable: true })
  nip?: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  created_at?: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  updated_at?: Date;

  @DeleteDateColumn({
    nullable: true,
  })
  deleted_at?: Date;

  @Column({ type: 'timestamptz', nullable: true, default: null })
  email_verified_at?: Date;

  @Column({ type: 'timestamptz', nullable: true, default: null })
  phone_verified_at?: Date;

  @Column({
    type: 'enum',
    enum: AdminStatus,
    default: AdminStatus.Waiting_for_approval,
  })
  status?: AdminStatus;

  @Column('uuid', { nullable: true })
  role_id?: string;

  role_name: string;

  @Column('uuid', { nullable: true })
  apps_id?: string;

  apps_name: string;

  @Column({ nullable: true })
  refresh_token: string;

  constructor(init?: Partial<AdminsDocument>) {
    Object.assign(this, init);
  }
}
