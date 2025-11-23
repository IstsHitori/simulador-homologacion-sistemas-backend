import { StudentApprovedSubject } from 'src/enrollment/entities/student-approved-subject.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Subject_version')
export class SubjectVersion {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 20 })
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
}
