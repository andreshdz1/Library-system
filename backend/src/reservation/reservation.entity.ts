import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  book_id: number;

  @Column()
  user_id: string;

  @Column()
  reservation: Date;

  @Column()
  due_date: Date;
}
