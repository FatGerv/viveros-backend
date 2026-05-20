import { IsString, IsNumber, IsOptional, Min, IsNotEmpty, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePlantDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre: string;

  @IsString()
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  descripcion: string;

  @IsNumber()
  @Min(0, { message: 'El precio no puede ser negativo' })
  @Type(() => Number)
  precio: number;

  @IsNumber()
  @Min(0, { message: 'El stock no puede ser negativo' })
  @Type(() => Number)
  stock: number;

  @IsString()
  @IsOptional()
  imagen?: string;

  @IsEnum(['sol', 'sombra', 'resolana'], { 
    message: 'La temporada debe ser: sol, sombra o resolana' 
  })
  @IsNotEmpty({ message: 'La temporada es obligatoria' })
  temporada: string;
}
