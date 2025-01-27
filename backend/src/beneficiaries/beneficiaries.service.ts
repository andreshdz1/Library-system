import { Workbook } from 'exceljs';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Beneficiaries } from './beneficiaries.entity';
import { CreateBeneficiaresDto } from './dto/createben.dto';

const workBook = new Workbook();
const worksheet = workBook.addWorksheet('beneficiarios');

worksheet.columns = [
  { header: 'id', key: 'id' },
  { header: 'rsocial', key: 'rsocial' },
  { header: 'address', key: 'address' },
  { header: 'contact', key: 'contact' },
  { header: 'number', key: 'number' },
  { header: 'program', key: 'program' },
  { header: 'material', key: 'material' },
  { header: 'registered', key: 'registered' },
];

@Injectable()
export class BeneficiariesService {
  constructor(
    @InjectRepository(Beneficiaries)
    private beneficiariesRepository: Repository<Beneficiaries>,
  ) {}
  async findAll(): Promise<Beneficiaries[]> {
    return this.beneficiariesRepository.find();
  }

  create(CreateBeneficiaresDto: CreateBeneficiaresDto): Promise<Beneficiaries> {
    const beneficiarie = new Beneficiaries();
    beneficiarie.rsocial = CreateBeneficiaresDto.rsocial;
    beneficiarie.address = CreateBeneficiaresDto.address;
    beneficiarie.contact = CreateBeneficiaresDto.contact;
    beneficiarie.number = CreateBeneficiaresDto.number;
    beneficiarie.program = CreateBeneficiaresDto.program;
    beneficiarie.material = CreateBeneficiaresDto.material;
    return this.beneficiariesRepository.save(beneficiarie);
  }

  async remove(id: number): Promise<void> {
    await this.beneficiariesRepository.delete(id);
  }
  //LOG IN
  async findBeneficiariesByRsocial(
    rsocial: string,
  ): Promise<Beneficiaries | null> {
    return await this.beneficiariesRepository.findOneBy({ rsocial });
  }
  //edit beneficiarie
  async editbeneficiarie(
    id: number,
    CreateBeneficiaresDto: CreateBeneficiaresDto,
  ): Promise<Beneficiaries> {
    const beneficiarie = await this.beneficiariesRepository.findOneBy({ id });
    if (beneficiarie) {
      beneficiarie.rsocial = CreateBeneficiaresDto.rsocial;
      beneficiarie.address = CreateBeneficiaresDto.address;
      beneficiarie.contact = CreateBeneficiaresDto.contact;
      beneficiarie.number = CreateBeneficiaresDto.number;
      beneficiarie.program = CreateBeneficiaresDto.program;
      beneficiarie.material = CreateBeneficiaresDto.material;
      return this.beneficiariesRepository.save(beneficiarie);
    }
    throw new Error('beneficiarie not found');
    console.log('beneficiarie not found');
  }
  async addJsonToExcel(jsonData: any[]): Promise<string> {
    jsonData.forEach((data) => {
      worksheet.addRow(data);
    });
    const file = 'beneficiarios.xlsx';
    await workBook.xlsx.writeFile(file);
    return file;
  }
}
