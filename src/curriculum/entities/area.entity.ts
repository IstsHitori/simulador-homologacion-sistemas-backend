import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

Entity('Area');
export class Area {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 40 })
  name: string;
}
