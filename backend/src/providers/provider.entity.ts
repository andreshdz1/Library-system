import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';
@Entity('providers')
export class Providers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  rsocial: string;

  @Column()
  name: string;

  @Column()
  fname: string;

  @Column()
  type: string;

  @Column()
  payment: string;

  @Column()
  period: string;

  @Column()
  percentage: number;

  @Column()
  account: number;
}
