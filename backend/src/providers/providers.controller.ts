import { Controller, Get, Delete, Post, Body, Param } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { Providers } from './provider.entity';
import { CreateProviderDto } from './dto/createProvider.dto';
import { emptyToNull } from 'src/utils/emptyToNull';

@Controller('providers')
export class ProvidersController {
  constructor(private ProvidersService: ProvidersService) {}
  @Post()
  create(@Body() CreateProviderDto: CreateProviderDto): Promise<Providers> {
    const transfomed = emptyToNull(CreateProviderDto);
    return this.ProvidersService.create(transfomed);
  }

  @Get()
  async findAll(): Promise<Providers[]> {
    return this.ProvidersService.findAll();
  }
  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.ProvidersService.remove(id);
  }
  //LOG IN
  @Post('findByRsocial')
  async findByEmail(@Body('email') email: string): Promise<Providers | null> {
    return await this.ProvidersService.findproviderByrsocial(email);
  }
  //edit user
  @Post('editProvider/:id')
  async editProvider(
    @Param('id') id: number,
    @Body() CreateProviderDto: CreateProviderDto,
  ): Promise<Providers> {
    const transfomed = emptyToNull(CreateProviderDto);
    return this.ProvidersService.editprovider(id, transfomed);
  }
}
