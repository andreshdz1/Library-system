import { Module } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { ProvidersController } from './providers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Providers } from './provider.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Providers])],
  providers: [ProvidersService],
  controllers: [ProvidersController],
  exports: [TypeOrmModule, ProvidersService],
})
export class ProvidersModule {}
