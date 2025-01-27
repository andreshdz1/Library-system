import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  administrator: boolean;

  @Column()
  email: string;

  @Column()
  number: string;

  @Column()
  password: string;

  @Column()
  recoverycode: string;
}
