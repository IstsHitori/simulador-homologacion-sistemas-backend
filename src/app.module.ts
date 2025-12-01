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
      useFactory: (config: ConfigService) => {
        const nodeEnv = config.get<string>('NODE_ENV');
        const isProduction = nodeEnv === 'production';

        const dbPrefix = isProduction ? 'PROD_DB_' : 'DEV_DB_';

        return {
          type: 'postgres',
          host: config.get<string>(`${dbPrefix}HOST`),
          port: config.get<number>(`${dbPrefix}PORT`),
          database: config.get<string>(`${dbPrefix}NAME`),
          username: config.get<string>(`${dbPrefix}USERNAME`),
          password: config.get<string>(`${dbPrefix}PASSWORD`),
          autoLoadEntities: true,
          synchronize: true,
          logging: !isProduction, // Solo logs en desarrollo
        };
      },
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
