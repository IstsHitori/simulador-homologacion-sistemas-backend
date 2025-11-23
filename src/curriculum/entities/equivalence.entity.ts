import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SubjectVersion } from './subject-version.entity';

@Entity('Equivalence')
@Index(['oldSubjectVersionId', 'newSubjectVersionId'], { unique: true })
export class Equivalence {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int' })
  oldSubjectVersionId: number;

  @Column({ type: 'int' })
  newSubjectVersionId: number;

  //---Relations---
  @ManyToOne(
    () => SubjectVersion,
    subjectVersion => subjectVersion.oldEquivalences,
  )
  @JoinColumn({ name: 'oldSubjectVersionId' })
  oldSubjectVersion: SubjectVersion;

  @ManyToOne(
    () => SubjectVersion,
    subjectVersion => subjectVersion.newEquivalences,
  )
  @JoinColumn({ name: 'newSubjectVersionId' })
  newSubjectVersion: SubjectVersion;
}
