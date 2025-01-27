import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Providers } from './provider.entity';
import { CreateProviderDto } from './dto/createProvider.dto';

@Injectable()
export class ProvidersService {
  constructor(
    @InjectRepository(Providers)
    private providerRepository: Repository<Providers>,
  ) {}
  async findAll(): Promise<Providers[]> {
    return this.providerRepository.find();
  }

  create(CreateProviderDto: CreateProviderDto): Promise<Providers> {
    const provider = new Providers();
    provider.rsocial = CreateProviderDto.rsocial;
    provider.name = CreateProviderDto.name;
    provider.fname = CreateProviderDto.fname;
    provider.type = CreateProviderDto.type;
    provider.payment = CreateProviderDto.payment;
    provider.period = CreateProviderDto.period;
    provider.percentage = CreateProviderDto.percentage;
    provider.account = CreateProviderDto.account;
    return this.providerRepository.save(provider);
  }

  async remove(id: number): Promise<void> {
    await this.providerRepository.delete(id);
  }
  //LOG IN
  async findproviderByrsocial(rsocial: string): Promise<Providers | null> {
    return await this.providerRepository.findOneBy({ rsocial });
  }
  //edit provider
  async editprovider(
    id: number,
    CreateProviderDto: CreateProviderDto,
  ): Promise<Providers> {
    const provider = await this.providerRepository.findOneBy({ id });
    if (provider) {
      provider.rsocial = CreateProviderDto.rsocial;
      provider.name = CreateProviderDto.name;
      provider.fname = CreateProviderDto.fname;
      provider.type = CreateProviderDto.type;
      provider.payment = CreateProviderDto.payment;
      provider.period = CreateProviderDto.period;
      provider.percentage = CreateProviderDto.percentage;
      provider.account = CreateProviderDto.account;
      return this.providerRepository.save(provider);
    }
    throw new Error('provider not found');
    console.log('provider not found');
  }
}
