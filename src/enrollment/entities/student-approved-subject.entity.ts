import { SubjectVersion } from 'src/curriculum/entities';
import { Student } from 'src/student/entities/student.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Student_approved_subject')
export class StudentApprovedSubject {
  @PrimaryGeneratedColumn('increment')
  id: number;

  //---Relations---
  @ManyToOne(() => Student, student => student.studentApprovedSubject)
  student: Student;

  @ManyToOne(
    () => SubjectVersion,
    subjectVersion => subjectVersion.studentApprovedSubject,
  )
  approvedSubjectVersion: SubjectVersion;
}
