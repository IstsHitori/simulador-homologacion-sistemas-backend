import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Equivalence')
export class Equivalence {
  @PrimaryGeneratedColumn('increment')
  id: number;

  oldSubjectVersionId: number;

  newSubjectVersionId: number;
}
