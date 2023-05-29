import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Provinces } from './provinces.entity';

@Entity({ name: 'admins_cities' })
export class Cities {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Provinces, (province) => province.id)
  @JoinColumn({ name: 'province_id' })
  province: Provinces;

  @Column()
  province_id: string;

  @Column()
  name: string;

  @CreateDateColumn({ nullable: true })
  created_at: Date;

  @UpdateDateColumn({ nullable: true })
  updated_at: Date;
}
