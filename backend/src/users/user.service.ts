import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './user.entity';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}
  async findAll(): Promise<Users[]> {
    return this.usersRepository.find();
  }

  create(CreateUserDto: CreateUserDto): Promise<Users> {
    const user = new Users();
    user.name = CreateUserDto.name;
    user.administrator = CreateUserDto.administrator;
    user.email = CreateUserDto.email;
    user.number = CreateUserDto.number;
    user.password = CreateUserDto.password;
    return this.usersRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
  //LOG IN
  async findUserByEmail(email: string): Promise<Users | null> {
    return await this.usersRepository.findOneBy({ email });
  }

  //edit user
  async editUser(id: number, CreateUserDto: CreateUserDto): Promise<Users> {
    const user = await this.usersRepository.findOneBy({ id });
    if (user) {
      user.name = CreateUserDto.name;
      user.administrator = CreateUserDto.administrator;
      user.email = CreateUserDto.email;
      user.number = CreateUserDto.number;
      user.password = CreateUserDto.password;
      return this.usersRepository.save(user);
    }
    throw new Error('User not found');
    console.log('User not found');
  }

  async setRecoveryCode(userId: number, code: string): Promise<void> {
    await this.usersRepository.update(userId, { recoverycode: code });
  }

  async clearRecoveryCode(userId: number): Promise<void> {
    await this.usersRepository.update(userId, { recoverycode: null });
  }

  async updatePassword(userId: number, newPassword: string): Promise<void> {
    await this.usersRepository.update(userId, { password: newPassword });
  }
  async findByResetToken(token: string): Promise<Users | undefined> {
    return this.usersRepository.findOne({ where: { recoverycode: token } });
  }
}
