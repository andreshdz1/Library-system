import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';
@Entity('beneficiaries')
export class Beneficiaries {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  rsocial: string;

  @Column()
  address: string;

  @Column()
  contact: string;

  @Column()
  number: number;

  @Column()
  program: string;

  @Column()
  material: string;

  @Column()
  registered: Date;
}
