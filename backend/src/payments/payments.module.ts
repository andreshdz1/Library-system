import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { movements } from './payments.entity';
import { PaymentService } from './payments.service';

@Module({
  imports: [TypeOrmModule.forFeature([movements])],
  controllers: [PaymentsController],
  providers: [PaymentService],
  exports: [TypeOrmModule, PaymentService],
})
export class PaymentsModule {}
