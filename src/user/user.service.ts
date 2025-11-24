import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Not, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashAdapter } from 'src/common/interfaces/hash.interface';
import { USER_ERROR_MESSAGES } from './constants';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject('HashAdapter')
    private readonly hasher: HashAdapter,
  ) {}
  async create(createUserDto: CreateUserDto) {
    await this.userRepository.save(
      this.userRepository.create({
        ...createUserDto,
        password: await this.hasher.hash(createUserDto.password),
      }),
    );
    return 'Usuario creado correctamente';
  }

  async findAll(userId: User['id']) {
    return await this.userRepository.find({
      where: {
        id: Not(userId),
      },
    });
  }

  async findOne(id: string) {
    const foundUser = await this.userRepository.findOne({ where: { id } });
    if (!foundUser)
      throw new NotFoundException(USER_ERROR_MESSAGES.USER_NOT_FOUND);
    return foundUser;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (this.hasEmptyFields(updateUserDto))
      return 'Usuario actualizado sin novedades';
    await this.findOne(id);
    await this.validateDuplicate(id, updateUserDto);
    await this.userRepository.update(id, updateUserDto);
    return 'Usuario actualizado correctamente';
  }

  private async validateDuplicate(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto) {
      const duplicateUser = await this.userRepository.findOne({
        where: [
          { email: updateUserDto.email },
          { userName: updateUserDto.userName },
        ],
      });

      if (duplicateUser && duplicateUser.id !== id)
        throw new BadRequestException(
          USER_ERROR_MESSAGES.USERNAME_OR_EMAIL_IN_USE,
        );
    }
  }

  private hasEmptyFields(updateUserDto: UpdateUserDto) {
    return Object.values(updateUserDto).length === 0;
  }

  async remove(id: string) {
    const foundUser = await this.findOne(id);
    await this.userRepository.remove(foundUser);
    return 'Usuario eliminado correctamente';
  }
}
