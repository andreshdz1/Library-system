import { Module } from '@nestjs/common';
import { ClasificationService } from './clasification.service';
import { ClasificationController } from './clasification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clasification } from './clasification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Clasification])],
  providers: [ClasificationService],
  controllers: [ClasificationController],
  exports: [TypeOrmModule, ClasificationService],
})
export class ClasificationModule {}
