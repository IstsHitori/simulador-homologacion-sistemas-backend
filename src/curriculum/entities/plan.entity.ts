import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Plan')
export class Plan {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;
}
