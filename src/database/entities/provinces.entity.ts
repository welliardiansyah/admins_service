import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Countries } from './countries.entity';

@Entity({ name: 'admins_provinces' })
export class Provinces {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Countries, (country) => country.id)
  @JoinColumn({ name: 'country_id' })
  country: Countries;

  @Column({ default: '2a2d29d5-0480-464f-b66f-7c7d8cc854da' })
  country_id: string;

  @Column()
  name: string;

  @CreateDateColumn({ nullable: true })
  created_at: Date;

  @UpdateDateColumn({ nullable: true })
  updated_at: Date;
}
