import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AUTH_ERROR_MESSAGES } from './constants';
import { HashAdapter } from 'src/common/interfaces/hash.interface';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { LoginUserDto, UpdatePasswordDto, UpdateProfileDto } from './dto';
import { USER_ERROR_MESSAGES } from 'src/user/constants';

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

  async updateProfile(id: string, updateProfileDto: UpdateProfileDto) {
    if (this.hasEmptyFields(updateProfileDto))
      return 'Perfil actualizado sin novedades';

    await this.findUser(id);

    await this.validateDuplicate(id, updateProfileDto);

    await this.userRepository.update(id, updateProfileDto);

    return 'Perfil actualizado correctamente';
  }

  async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    if (this.hasEmptyFields(updatePasswordDto))
      throw new BadRequestException(AUTH_ERROR_MESSAGES.EMPTY_FIELDS);
    if (!this.passwordMatch(updatePasswordDto))
      throw new BadRequestException(
        AUTH_ERROR_MESSAGES.NEW_PASSWORD_AND_CONFIRM_NEW_PASSWORD_MATCH,
      );

    const foundUserToUpdate = await this.findUser(id);

    const areEqualsPassword = await this.hasher.compare(
      updatePasswordDto.newPassword!,
      foundUserToUpdate.password,
    );

    if (areEqualsPassword)
      throw new BadRequestException(AUTH_ERROR_MESSAGES.PASSWORD_ALREADY_EXIST);

    const isValidPassword = await this.hasher.compare(
      updatePasswordDto.currentPassword!,
      foundUserToUpdate.password,
    );
    if (!isValidPassword)
      throw new BadRequestException(
        AUTH_ERROR_MESSAGES.CURRENT_PASSWORD_INVALID,
      );

    const newPasswordHashed = await this.hasher.hash(
      updatePasswordDto.newPassword!,
    );

    foundUserToUpdate.password = newPasswordHashed;

    await this.userRepository.save(foundUserToUpdate);

    return 'Contraseña actualizada correctamente';
  }

  getUserProfile({ id, fullName, userName, role }: User) {
    return { id, fullName, userName, role };
  }

  private async findUser(id: string) {
    const foundUser = await this.userRepository.findOne({ where: { id } });

    if (!foundUser)
      throw new NotFoundException(USER_ERROR_MESSAGES.USER_NOT_FOUND);
    return foundUser;
  }

  private passwordMatch(updatePasswordDto: UpdatePasswordDto) {
    return updatePasswordDto.newPassword === updatePasswordDto.confirmPassword;
  }

  private async validateDuplicate(
    id: string,
    updateProfileDto: UpdateProfileDto,
  ) {
    if (updateProfileDto) {
      // Solo validar si se envían email o userName
      if (!updateProfileDto.email && !updateProfileDto.userName) {
        return;
      }

      const whereConditions: any[] = [];
      if (updateProfileDto.email) {
        whereConditions.push({ email: updateProfileDto.email });
      }
      if (updateProfileDto.userName) {
        whereConditions.push({ userName: updateProfileDto.userName });
      }

      if (whereConditions.length === 0) {
        return;
      }

      const duplicateUser = await this.userRepository.findOne({
        where: whereConditions,
      });

      if (duplicateUser && duplicateUser.id !== id)
        throw new BadRequestException(
          USER_ERROR_MESSAGES.USERNAME_OR_EMAIL_IN_USE,
        );
    }
  }

  private hasEmptyFields(
    updateProfileDto: UpdateProfileDto | UpdatePasswordDto,
  ) {
    return Object.values(updateProfileDto).length === 0;
  }

  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }
}
