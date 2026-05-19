import { Injectable } from '@nestjs/common';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';

@Injectable()
export class PlantsService {
  private plantas: any[] = []; // Arreglo en memoria (PDF 06)
  private currentId = 1;

  create(createPlantDto: CreatePlantDto) {
    const nuevaPlanta = { id: this.currentId++, ...createPlantDto };
    this.plantas.push(nuevaPlanta);
    return nuevaPlanta;
  }

  findAll() {
    return this.plantas;
  }

  findOne(id: number) {
    return this.plantas.find(p => p.id === id);
  }

  update(id: number, updatePlantDto: UpdatePlantDto) {
    const index = this.plantas.findIndex(p => p.id === id);
    if (index === -1) return null;
    // Actualiza solo los campos enviados (spread operator, PDF 02)
    this.plantas[index] = { ...this.plantas[index], ...updatePlantDto };
    return this.plantas[index];
  }

  delete(id: number) {
    const index = this.plantas.findIndex(p => p.id === id);
    if (index === -1) return false;
    this.plantas.splice(index, 1);
    return true;
  }
}
