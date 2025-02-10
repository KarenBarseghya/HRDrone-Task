import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUsersDto } from './dto/get-user.dto';
import { User } from '@prisma/client';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('exists/:id')
  async checkUserExists(@Param('id') id: string): Promise<boolean> {
    return this.usersService.checkUserExists(id);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<Omit<User, 'password'>> {
    return this.usersService.getUserById(id);
  }

  @Get()
  async getUsers(
    @Query() getUsersDto: GetUsersDto,
  ): Promise<Omit<User, 'password'>[]> {
    return this.usersService.getUsers(getUsersDto);
  }
}
