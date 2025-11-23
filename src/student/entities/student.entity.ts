import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { META_GENDERS } from '../constants';
import { StudentApprovedSubject } from 'src/enrollment/entities/student-approved-subject.entity';

@Entity('Student')
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 11 })
  identification: string;

  @Column({ type: 'varchar', length: 100 })
  email: string;

  @Column({ type: 'varchar', length: 40 })
  names: string;

  @Column({ type: 'varchar', length: 40 })
  lastNames: string;

  @Column({ type: 'varchar', length: 20 })
  cityResidence: string;

  @Column({ type: 'varchar', length: 20 })
  address: string;

  @Column({ type: 'varchar', length: 10 })
  telephone: string;

  @Column({ type: 'enum', enum: META_GENDERS })
  gender: META_GENDERS;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  //-----Relations-----
  @OneToMany(
    () => StudentApprovedSubject,
    studentApproved => studentApproved.student,
  )
  studentApprovedSubject: StudentApprovedSubject[];
}
