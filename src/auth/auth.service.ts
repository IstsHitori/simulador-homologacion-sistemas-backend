import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AUTH_ERROR_MESSAGES } from './constants';
import { HashAdapter } from 'src/common/interfaces/hash.interface';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject('HashAdapter')
    private readonly hasher: HashAdapter,
    private readonly jwtService: JwtService,
  ) {}

  async signin(loginUserDto: LoginUserDto) {
    const findUser = await this.userRepository.findOne({
      where: {
        userName: loginUserDto.userName,
      },
    });

    if (!findUser)
      throw new UnauthorizedException(AUTH_ERROR_MESSAGES.USER_NOT_FOUND);

    const isValidPassword = await this.hasher.compare(
      loginUserDto.password,
      findUser.password,
    );
    if (!isValidPassword)
      throw new BadRequestException(AUTH_ERROR_MESSAGES.PASSWORD_INVALID);

    const token = this.getJwtToken({ id: findUser.id });
    return { token };
  }

  getUserProfile({ id, fullName, userName, role }: User) {
    return { id, fullName, userName, role };
  }

  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }
}
