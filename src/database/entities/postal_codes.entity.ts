import { IsUUID } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cities } from './cities.entity';

@Entity({ name: 'admins_postal_codes' })
export class PostalCodes {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Cities, (city) => city.id)
  @JoinColumn({ name: 'city_id' })
  city: Cities;

  @Column()
  @IsUUID()
  city_id: string;

  @Column()
  postal_code: string;

  @CreateDateColumn({ nullable: true })
  created_at: Date;

  @UpdateDateColumn({ nullable: true })
  updated_at: Date;
}
