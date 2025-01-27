import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Clients } from './clients.entity';
import { CreateClientDto } from './dto/createclient.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Clients)
    private ClientsRepository: Repository<Clients>,
  ) {}
  async findAll(): Promise<Clients[]> {
    return this.ClientsRepository.find();
  }

  create(CreateClientDto: CreateClientDto): Promise<Clients> {
    const client = new Clients();
    client.name = CreateClientDto.name;
    client.email = CreateClientDto.email;
    client.number = CreateClientDto.number;
    client.preferences = CreateClientDto.preferences;
    client.intern = CreateClientDto.intern;
    return this.ClientsRepository.save(client);
  }

  async remove(id: number): Promise<void> {
    await this.ClientsRepository.delete(id);
  }
  //LOG IN
  async findClientByEmail(email: string): Promise<Clients | null> {
    return await this.ClientsRepository.findOneBy({ email });
  }
  async findByName(name: string): Promise<boolean> {
    const client = await this.ClientsRepository.findOneBy({ name });
    return client !== null;
  }
  //edit client
  async editClient(
    id: number,
    CreateClientDto: CreateClientDto,
  ): Promise<Clients> {
    const client = await this.ClientsRepository.findOneBy({ id });
    if (client) {
      client.name = CreateClientDto.name;
      client.email = CreateClientDto.email;
      client.number = CreateClientDto.number;
      client.preferences = CreateClientDto.preferences;
      client.intern = CreateClientDto.intern;
      return this.ClientsRepository.save(client);
    }
    throw new Error('client not found');
  }
}
