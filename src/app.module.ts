import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlantsModule } from './plants/plants.module';
import { Plant } from './plants/plant.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql', // o 'postgres' si usas PostgreSQL
      host: 'localhost',
      port: 3306, // 5432 para PostgreSQL
      username: 'root',
      password: '1234',
      database: 'viveros_db',
      entities: [Plant],
      synchronize: true, // Solo para desarrollo
    }),
    PlantsModule,
  ],
})
export class AppModule {}
