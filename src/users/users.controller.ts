import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from '@thallesp/nestjs-better-auth';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('all')
  @Roles(['admin'])
  findAllUsers() {
    const result = this.usersService.findAllUsers();
    return result;
  }

  @Get(':id')
  @Roles(['admin'])
  findOneUser(@Param('id') id: string) {
    const result = this.usersService.findOneUser(id);
    return result;
  }
}
