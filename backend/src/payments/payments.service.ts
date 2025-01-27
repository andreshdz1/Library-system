import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { movements } from './payments.entity';
import { createPayment } from './dto/createPayment.dto';
import { Workbook } from 'exceljs';

const workBook = new Workbook();
const worksheet = workBook.addWorksheet('Movimientos');
const workBookComission = new Workbook();
const worksheetComission = workBookComission.addWorksheet('Corte de caja');
worksheetComission.columns = [
  { header: 'id', key: 'id' },
  { header: 'articulo', key: 'article' },
  { header: 'tipo de transaccion', key: 'transaction_type' },
  { header: 'total', key: 'total' },
  { header: 'titulo', key: 'title' },
  { header: 'ISBN', key: 'isbn' },
  { header: 'id de articulo', key: 'id_article' },
  { header: 'nombre de usuario', key: 'user_name' },
  { header: 'fecha', key: 'date' },
  { header: 'clientes', key: 'clients' },
];
worksheet.columns = [
  { header: 'id', key: 'id' },
  { header: 'articulo', key: 'article' },
  { header: 'tipo de transaccion', key: 'transaction_type' },
  { header: 'total', key: 'total' },
  { header: 'titulo', key: 'title' },
  { header: 'ISBN', key: 'isbn' },
  { header: 'id de articulo', key: 'id_article' },
  { header: 'nombre de usuario', key: 'user_name' },
  { header: 'fecha', key: 'date' },
  { header: 'clientes', key: 'clients' },
];
@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(movements)
    private paymentService: Repository<movements>,
  ) {}

  async findAll(): Promise<movements[]> {
    return this.paymentService.find();
  }

  async create(createPaymentDto: createPayment): Promise<movements> {
    const payment = this.paymentService.create(createPaymentDto);
    return this.paymentService.save(payment);
  }

  async remove(id: number): Promise<void> {
    const result = await this.paymentService.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
  }

  async editpayment(
    id: number,
    updatePaymentDto: createPayment,
  ): Promise<movements> {
    const payment = await this.paymentService.findOne({ where: { id } });
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    Object.assign(payment, updatePaymentDto);
    return this.paymentService.save(payment);
  }

  async calcComissions(
    user_name: string | null,
    start_date: string,
    end_date: string,
  ): Promise<{ commissionData: any[]; totalCommission: number }> {
    if (!start_date || !end_date) {
      throw new BadRequestException('Start date and end date are required');
    }

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    const queryBuilder = this.paymentService
      .createQueryBuilder('movements')
      .select(['movements.total'])
      .where('movements.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    if (user_name) {
      queryBuilder.andWhere('movements.user_name = :user_name', { user_name });
    }

    const commissionData = await queryBuilder.getMany();
    console.log('Commission data:', commissionData);
    const totalCommission = commissionData.reduce(
      (sum, item) => sum + Number(item.total),
      0,
    );
    return { commissionData, totalCommission };
  }

  async addJsonToExcel(jsonData: any[]): Promise<string> {
    jsonData.forEach((data) => {
      worksheet.addRow(data);
    });
    const file = 'Movimientos.xlsx';
    await workBook.xlsx.writeFile(file);
    return file;
  }
  async addJsonDay(): Promise<string> {
    const Data = this.paymentService
      .createQueryBuilder('movements')
      .select()
      .where('movements.date = :date', {
        date: new Date(),
      });
    const jsonData = await Data.getMany();
    jsonData.forEach((data) => {
      worksheetComission.addRow(data);
    });
    const file = 'Corte de Caja.xlsx';
    await workBook.xlsx.writeFile(file);
    return file;
  }
  async getDailyTransactions(): Promise<{ total: number; tot_mov: number }> {
    const queryTotal = this.paymentService
      .createQueryBuilder('movements')
      .select(['movements.total'])
      .where('movements.date = :date', {
        date: new Date(),
      });
    const total = await queryTotal.getMany();
    const totalAmount = total.reduce(
      (sum, item) => sum + Number(item.total),
      0,
    );

    const queryMovs = this.paymentService
      .createQueryBuilder('movements')
      .select(['movements.id'])
      .where('movements.date = :date', {
        date: new Date(),
      });
    const tot_mov = await queryMovs.getMany();
    const totalMovements = tot_mov.length;
    return { total: totalAmount, tot_mov: totalMovements };
  }
}
