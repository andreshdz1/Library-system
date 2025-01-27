import {
  Controller,
  Get,
  Delete,
  Post,
  Body,
  Param,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { BeneficiariesService } from './beneficiaries.service';
import { Beneficiaries } from './beneficiaries.entity';
import { CreateBeneficiaresDto } from './dto/createben.dto';
import { emptyToNull } from 'src/utils/emptyToNull';

@Controller('beneficiaries')
export class BeneficiariesController {
  constructor(private BeneficiariesService: BeneficiariesService) {}
  @Post()
  create(
    @Body() CreateBeneficiaresDto: CreateBeneficiaresDto,
  ): Promise<Beneficiaries> {
    const transfomed = emptyToNull(CreateBeneficiaresDto);
    return this.BeneficiariesService.create(transfomed);
  }

  @Get()
  async findAll(): Promise<Beneficiaries[]> {
    return this.BeneficiariesService.findAll();
  }
  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.BeneficiariesService.remove(id);
  }
  //LOG IN
  @Post('findByRsocial')
  async findByEmail(
    @Body('rsocial') rsocial: string,
  ): Promise<Beneficiaries | null> {
    return await this.BeneficiariesService.findBeneficiariesByRsocial(rsocial);
  }
  //edit user
  @Post('editBeneficiaries/:id')
  async editBeneficiaries(
    @Param('id') id: number,
    @Body() CreateBeneficiaresDto: CreateBeneficiaresDto,
  ): Promise<Beneficiaries> {
    const transfomed = emptyToNull(CreateBeneficiaresDto);
    return this.BeneficiariesService.editbeneficiarie(id, transfomed);
  }
  //excel
  @Get('excel')
  async export(@Res() res: Response): Promise<void> {
    const jsonData = await this.BeneficiariesService.findAll();
    const file = await this.BeneficiariesService.addJsonToExcel(jsonData);
    res.download(file, 'beneficiarios.xlsx');
  }
}
