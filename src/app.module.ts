import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PlantsModule } from './plants/plants.module';
import { AuthModule } from './auth/auth.module';
import { Plant } from './plants/plant.entity';
import { User } from './auth/entities/user.entity';
import { Role } from './auth/entities/role.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '1234',
      database: process.env.DB_NAME || 'viveros_db',
      entities: [Plant, User, Role], // ← Nuevas entidades
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV === 'development',
    }),
    PlantsModule,
    AuthModule, // ← Registro del módulo
  ],
})
export class AppModule {}