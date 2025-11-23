import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SubjectVersion } from './subject-version.entity';

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

  //---Relations---
  @OneToMany(() => SubjectVersion, subjectVersion => subjectVersion.plan)
  subjectVersion: SubjectVersion[];
}
