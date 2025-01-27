import { Controller, Get, Delete, Post, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { Users } from './user.entity';
import { CreateUserDto } from './dto/createUser.dto';
@Controller('users')
export class UsersController {
  constructor(private userService: UserService) {}
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<Users> {
    return this.userService.create(createUserDto);
  }

  @Get()
  async findAll(): Promise<Users[]> {
    return this.userService.findAll();
  }
  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.userService.remove(id);
  }
  //LOG IN
  @Post('findByEmail')
  async findByEmail(@Body('email') email: string): Promise<Users | null> {
    return await this.userService.findUserByEmail(email);
  }
  //edit user
  @Post('editUser/:id')
  async editUser(
    @Param('id') id: number,
    @Body() createUserDto: CreateUserDto,
  ): Promise<Users> {
    return this.userService.editUser(id, createUserDto);
  }
}
