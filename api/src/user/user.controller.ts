import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':idx')
  findOne(@Param('idx', ParseIntPipe) idx: number) {
    return this.userService.findOne(idx);
  }

  @Patch(':idx')
  update(@Param('idx', ParseIntPipe) idx: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(idx, updateUserDto);
  }

  @Delete(':idx')
  remove(@Param('idx', ParseIntPipe) idx: number) {
    return this.userService.remove(idx);
  }
}
