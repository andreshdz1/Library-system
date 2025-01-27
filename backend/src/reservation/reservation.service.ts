import { Injectable } from '@nestjs/common';
import { Reservation } from './reservation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createReservationDto } from './dto/createReservation.dto';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
  ) {}

  async findAll(): Promise<Reservation[]> {
    return this.reservationRepository.find();
  }

  async create(
    createReservationDto: createReservationDto,
  ): Promise<Reservation> {
    const reservation = new Reservation();
    reservation.book_id = createReservationDto.book_id;
    reservation.user_id = createReservationDto.user_id;
    reservation.due_date = createReservationDto.due_date;
    return await this.reservationRepository.save(reservation);
  }

  async remove(id: number): Promise<void> {
    await this.reservationRepository.delete(id);
  }
}
