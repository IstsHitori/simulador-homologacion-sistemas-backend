import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ENV_VALIDATION_SCHEMA } from './config/env.validation';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { StudentModule } from './student/student.module';
import { CurriculumModule } from './curriculum/curriculum.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { HomologationModule } from './homologation/homologation.module';

@Module({
  imports: [
    ConfigModule.forRoot({ validationSchema: ENV_VALIDATION_SCHEMA }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        database: config.get<string>('DB_NAME'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        autoLoadEntities: true,
        //Cuando hacemos algún cambio en las entidades aumaticamente las sincroniza
        synchronize: true,
      }),
    }),
    AuthModule,
    UserModule,
    CommonModule,
    SeedModule,
    StudentModule,
    CurriculumModule,
    EnrollmentModule,
    HomologationModule,
  ],
})
export class AppModule {}
