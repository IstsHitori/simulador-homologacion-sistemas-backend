import { StudentApprovedSubject } from 'src/enrollment/entities/student-approved-subject.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Plan } from './plan.entity';
import { Area } from './area.entity';
import { Equivalence } from './equivalence.entity';

@Entity('Subject_version')
export class SubjectVersion {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 20, nullable: true, default: 'N/A' })
  code: string;

  @Column({ type: 'int' })
  semester: number;

  @Column({ type: 'int' })
  credits: number;

  //---Relations---
  @OneToMany(
    () => StudentApprovedSubject,
    studentApproved => studentApproved.approvedSubjectVersion,
  )
  studentApprovedSubject: StudentApprovedSubject[];

  @OneToMany(() => Equivalence, equivalence => equivalence.oldSubjectVersion)
  oldEquivalences: Equivalence[];

  @OneToMany(() => Equivalence, equivalence => equivalence.newSubjectVersion)
  newEquivalences: Equivalence[];

  @ManyToOne(() => Plan, plan => plan.subjectVersion)
  plan: Plan;

  @ManyToOne(() => Area, area => area.subjectVersion)
  area: Area;
}
