import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Clients {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  number: string;

  @Column()
  preferences: string;

  @Column()
  intern: boolean;
}
