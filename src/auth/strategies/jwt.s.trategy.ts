import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AUTH_ERROR_MESSAGES } from '../constants';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  //Cuando definimos el constructor, el PassportStrategy por defecto necesita llamar al padre
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    configService: ConfigService,
  ) {
    super({
      //Para decirle al padre que el JWT viene desde Bearer Token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  //Este metodo se llamará si el JWT no ha expirado y la firma del JWT hace match con el payload
  async validate(payload: JwtPayload): Promise<User> {
    const { id } = payload;
    const findUser = await this.userRepository.findOne({
      where: {
        id,
      },
      select: {
        password: false,
      },
    });
    if (!findUser)
      throw new UnauthorizedException(AUTH_ERROR_MESSAGES.UNHAUTORIZED);
    if (!findUser.isActive)
      throw new UnauthorizedException(AUTH_ERROR_MESSAGES.INACTIVATED);

    return findUser;
  }
}
