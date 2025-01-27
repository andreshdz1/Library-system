import { Controller, Get, Delete, Post, Body, Param } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/createclient.dto';
import { Clients } from './clients.entity';

@Controller('clients')
export class ClientsController {
  constructor(private ClientsService: ClientsService) {}
  @Post()
  create(@Body() createClientDto: CreateClientDto): Promise<Clients> {
    return this.ClientsService.create(createClientDto);
  }

  @Get()
  async findAll(): Promise<Clients[]> {
    return this.ClientsService.findAll();
  }
  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.ClientsService.remove(id);
  }
  //LOG IN
  @Post('findByEmail')
  async findByEmail(@Body('email') email: string): Promise<Clients | null> {
    return await this.ClientsService.findClientByEmail(email);
  }
  @Post('findByName')
  async findByName(@Body('name') name: string): Promise<boolean> {
    return await this.ClientsService.findByName(name);
  }
  //edit Client
  @Post('editClient/:id')
  async editClient(
    @Param('id') id: number,
    @Body() CreateClientDto: CreateClientDto,
  ): Promise<Clients> {
    return this.ClientsService.editClient(id, CreateClientDto);
  }
}
