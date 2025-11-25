import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  DeleteDateColumn,
} from 'typeorm';

@Entity('places')
@Index(['latitude', 'longitude'])
@Index(['category'])
@Index(['isHiddenGem'])
export class Place {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 100 })
  category: string;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  longitude: number;

  @Column({ type: 'text' })
  address: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imageUrl: string;

  @Column({ type: 'boolean', default: false })
  isHiddenGem: boolean;

  @Column({ type: 'time', nullable: true })
  openingTime?: string;

  @Column({ type: 'time', nullable: true })
  closingTime?: string;

  @Column({ type: 'integer', nullable: true })
  tourDuration?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ nullable: true, name: 'narrative_store_id' })
  narrativeStoreId?: string;

  @Column({ nullable: true, name: 'narrative_document_id' })
  narrativeDocumentId?: string;

  @Column('simple-array', { nullable: true })
closedDays?: string[] | null; //["monday","tuesday"]

@Column('jsonb', { nullable: true })
scheduleByDay?: {
  monday?: { open: string; close: string };
  tuesday?: { open: string; close: string };
  wednesday?: { open: string; close: string };
  thursday?: { open: string; close: string };
  friday?: { open: string; close: string };
  saturday?: { open: string; close: string };
  sunday?: { open: string; close: string };
} | null;

@Column('jsonb', { nullable: true })
crowdInfo?: {
  peakDays?: string[];      // ["saturday", "sunday"]
  peakHours?: string[];     // ["11:00-13:00"]
  bestDays?: string[];      // ["tuesday", "wednesday"]
  bestHours?: string[];     // ["09:30-11:00", "15:00-16:00"]
} | null;
}