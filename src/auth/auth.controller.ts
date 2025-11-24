import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';
import { GetUser } from './decorators/get-user-decorator';
import { User } from 'src/user/entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdatePasswordDto, UpdateProfileDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signin(@Body() loginUserDto: LoginUserDto) {
    const message = await this.authService.signin(loginUserDto);
    return message;
  }

  @Auth()
  @Get('profile')
  getUserProfile(@GetUser() user: User) {
    return this.authService.getUserProfile(user);
  }

  @Auth()
  @Patch('update-profile')
  updateProfile(
    @GetUser() user: User,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.authService.updateProfile(user.id, updateProfileDto);
  }

  @Auth()
  @Patch('update-password')
  updatePassword(
    @GetUser() user: User,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.authService.updatePassword(user.id, updatePasswordDto);
  }
}
