import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ROLE } from './constants';
import { GetUser } from 'src/auth/decorators/get-user-decorator';
import { User } from './entities/user.entity';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';

@Controller('user')
@Auth(ROLE.ADMIN)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll(@GetUser() user: User) {
    return this.userService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() user: User,
  ) {
    return this.userService.update(user.id, id, updateUserDto);
  }

  @Patch('update-password/:id')
  updateUserPassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserPassword: UpdateUserPasswordDto,
  ) {
    return this.userService.updateUserPassword(id, updateUserPassword);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.remove(id);
  }
}
