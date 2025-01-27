import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('clasifications')
export class Clasification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  class: string;

  @Column()
  location: string;
}
