import { Module } from '@nestjs/common';
import { BeneficiariesService } from './beneficiaries.service';
import { BeneficiariesController } from './beneficiaries.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Beneficiaries } from './beneficiaries.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Beneficiaries])],
  providers: [BeneficiariesService],
  controllers: [BeneficiariesController],
  exports: [TypeOrmModule, BeneficiariesService],
})
export class BeneficiariesModule {}
