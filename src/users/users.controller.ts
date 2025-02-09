import { Controller, Get, Query } from '@nestjs/common';
import { GetUsersDto } from './dto/get-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('/user')
  getUsers(@Query() query: GetUsersDto) {
    return this.userService.getUsers(query);
  }
}
