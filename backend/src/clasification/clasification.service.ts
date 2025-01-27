import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Clasification } from './clasification.entity';
import { Repository } from 'typeorm';
import { CreateClasificationDto } from './dto/createClasification.tdo';

@Injectable()
export class ClasificationService {
  constructor(
    @InjectRepository(Clasification)
    private ClasificationRepository: Repository<Clasification>,
  ) {}
  async findAll(): Promise<Clasification[]> {
    return this.ClasificationRepository.find();
  }
  async remove(id: number): Promise<void> {
    this.ClasificationRepository.delete(id);
  }
  async create(
    CreateClasificationDto: CreateClasificationDto,
  ): Promise<Clasification> {
    const clasification = new Clasification();
    clasification.class = CreateClasificationDto.class;
    clasification.location = CreateClasificationDto.location;
    return this.ClasificationRepository.save(clasification);
  }
}
