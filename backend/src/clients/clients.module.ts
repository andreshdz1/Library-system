import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clients } from './clients.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Clients])],
  providers: [ClientsService],
  controllers: [ClientsController],
  exports: [TypeOrmModule, ClientsService],
})
export class ClientsModule {}
