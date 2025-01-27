import { Controller, Post, Body, Get, Delete, Param } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { createReservationDto } from './dto/createReservation.dto';
import { Reservation } from './reservation.entity';

@Controller('reservation')
export class ReservationController {
  constructor(private reservationService: ReservationService) {}

  @Post()
  create(
    @Body() createReservationDto: createReservationDto,
  ): Promise<Reservation> {
    return this.reservationService.create(createReservationDto);
  }

  @Get()
  findAll(): Promise<Reservation[]> {
    return this.reservationService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.reservationService.remove(id);
  }
}
