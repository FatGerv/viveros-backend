import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plant } from './plant.entity';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';

@Injectable()
export class PlantsService {
  constructor(
    @InjectRepository(Plant)
    private plantsRepository: Repository<Plant>,
  ) {}

  async create(createPlantDto: CreatePlantDto): Promise<Plant> {
    const plant = this.plantsRepository.create(createPlantDto);
    return await this.plantsRepository.save(plant);
  }

  async findAll(): Promise<Plant[]> {
    return await this.plantsRepository.find();
  }

  async findOne(id: number): Promise<Plant> {
    const plant = await this.plantsRepository.findOne({ where: { id } });
    if (!plant) {
      throw new NotFoundException(`Planta con ID ${id} no encontrada`);
    }
    return plant;
  }

  async update(id: number, updatePlantDto: UpdatePlantDto): Promise<Plant> {
    const plant = await this.findOne(id);
    Object.assign(plant, updatePlantDto);
    return await this.plantsRepository.save(plant);
  }

  async remove(id: number): Promise<void> {
    const plant = await this.findOne(id);
    await this.plantsRepository.remove(plant);
  }

  // Métodos adicionales según requerimientos
  async findByTemporada(temporada: string): Promise<Plant[]> {
    return await this.plantsRepository.find({ where: { temporada } });
  }

  async findByName(nombre: string): Promise<Plant[]> {
    return await this.plantsRepository
      .createQueryBuilder('plant')
      .where('plant.nombre LIKE :nombre', { nombre: `%${nombre}%` })
      .getMany();
  }

  async findWithStock(): Promise<Plant[]> {
    return await this.plantsRepository.find({ where: { stock: MoreThan(0) } });
  }

  async findByPriceRange(minPrice: number, maxPrice: number): Promise<Plant[]> {
    return await this.plantsRepository
      .createQueryBuilder('plant')
      .where('plant.precio BETWEEN :minPrice AND :maxPrice', { minPrice, maxPrice })
      .getMany();
  }

  async updateStock(id: number, quantity: number): Promise<Plant> {
    const plant = await this.findOne(id);
    plant.stock -= quantity;
    if (plant.stock < 0) {
      plant.stock = 0;
    }
    return await this.plantsRepository.save(plant);
  }
}

import { MoreThan } from 'typeorm';
