import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('books')
export class Catalog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  isbn: string;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  editorial: string;

  @Column()
  edition: string;

  @Column()
  conditions: string;

  @Column()
  clasification: string;

  @Column()
  location: string;

  @Column()
  amount: number;

  @Column()
  price: number;

  @Column()
  queue: boolean;
}
