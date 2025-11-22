import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ROLE } from 'src/user/constants';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { HashAdapter } from 'src/common/interfaces/hash.interface';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    @Inject('HashAdapter')
    private readonly hasher: HashAdapter,
  ) {}

  async execute() {
    await this.adminSeed();
  }

  async adminSeed() {
    const existAdmin = await this.validateExistUser();
    if (existAdmin) return;

    this.logger.log('CREANDO USUARIO ADMINISTADOR....');

    const fullName = this.configService.get<string>('ADMIN_NAME');

    const password = this.configService.get<string>('ADMIN_PASSWORD');

    const passwordEncrypted = await this.hasher.hash(password!);

    const userName = this.configService.get<string>('ADMIN_USERNAME');

    const email = this.configService.get<string>('ADMIN_EMAIL');

    const newUser = this.userRepository.create({
      fullName,
      password: passwordEncrypted,
      userName,
      email,
      role: ROLE.ADMIN,
    });
    await this.userRepository.save(newUser);
    this.logger.log('USUARIO ADMINISTRADOR CREADO');
  }

  private async validateExistUser() {
    const existOtherAdmin = await this.userRepository.findOne({
      where: { role: ROLE.ADMIN },
    });
    return existOtherAdmin ? true : false;
  }
}
