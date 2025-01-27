import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('movements')
export class movements {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  article: string;

  @Column()
  transaction_type: string;

  @Column()
  total: number;

  @Column()
  title: string;

  @Column()
  isbn: string;

  @Column()
  id_article: number;

  @Column()
  user_name: string;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column()
  clients: string;
}
