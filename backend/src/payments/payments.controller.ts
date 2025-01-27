import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  Param,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { PaymentService } from './payments.service';
import { createPayment } from './dto/createPayment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  async findAll() {
    return this.paymentService.findAll();
  }

  @Post()
  async create(@Body() createPaymentDto: createPayment) {
    return this.paymentService.create(createPaymentDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePaymentDto: createPayment,
  ) {
    return this.paymentService.editpayment(+id, updatePaymentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.paymentService.remove(+id);
  }

  @Post('comissions')
  async getCommissionData(
    @Body()
    params: {
      user_name?: string;
      start_date: string;
      end_date: string;
    },
  ) {
    const { user_name, start_date, end_date } = params;
    const commission = await this.paymentService.calcComissions(
      user_name,
      start_date,
      end_date,
    );
    return commission;
  }
  //excel
  @Get('excel')
  async export(@Res() res: Response): Promise<void> {
    const jsonData = await this.paymentService.findAll();
    console.log(jsonData);
    const file = await this.paymentService.addJsonToExcel(jsonData);
    res.download(file, 'Movimientos.xlsx');
  }
  @Get('excelDay')
  async exportDay(@Res() res: Response): Promise<void> {
    const file = await this.paymentService.addJsonDay();
    res.download(file, 'Corte de Caja.xlsx');
  }

  @Get('dailyTran')
  async getDailyTransactions() {
    const result = await this.paymentService.getDailyTransactions();
    return {
      totAmount: result.total,
      totMov: result.tot_mov,
    };
  }
}
