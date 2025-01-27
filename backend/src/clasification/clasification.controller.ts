import { Controller, Delete, Get, Param, Post, Body } from '@nestjs/common';
import { Clasification } from './clasification.entity';
import { ClasificationService } from './clasification.service';
import { CreateClasificationDto } from './dto/createClasification.tdo';

@Controller('clasification')
export class ClasificationController {
  constructor(private ClasificationService: ClasificationService) {}
  @Get()
  async findAll(): Promise<Clasification[]> {
    return this.ClasificationService.findAll();
  }
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    await this.ClasificationService.remove(id);
    return;
  }
  @Post()
  create(
    @Body() CreateClasificationDto: CreateClasificationDto,
  ): Promise<Clasification> {
    return this.ClasificationService.create(CreateClasificationDto);
  }
}
