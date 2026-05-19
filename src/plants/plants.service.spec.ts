import { Injectable } from '@nestjs/common';
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

  create(createPlantDto: CreatePlantDto): Promise<Plant> {
    const plant = this.plantsRepository.create(createPlantDto);
    return this.plantsRepository.save(plant);
  }

  findAll(): Promise<Plant[]> {
    return this.plantsRepository.find();
  }

  findOne(id: number): Promise<Plant> {
    return this.plantsRepository.findOneBy({ id });
  }

  async update(id: number, updatePlantDto: UpdatePlantDto): Promise<Plant> {
    await this.plantsRepository.update(id, updatePlantDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.plantsRepository.delete(id);
  }
}
