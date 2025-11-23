import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SubjectVersion } from './subject-version.entity';

@Entity('Area')
export class Area {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 40 })
  name: string;

  //---Relations---
  @OneToMany(() => SubjectVersion, subjectVersion => subjectVersion.area)
  subjectVersion: SubjectVersion[];
}
