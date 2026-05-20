import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
  UseGuards,
  Request
} from '@nestjs/common';
import { PlantsService } from './plants.service';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';
import { Plant } from './plant.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('plants')
@UseGuards(JwtAuthGuard)
export class PlantsController {
  constructor(private readonly plantsService: PlantsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPlantDto: CreatePlantDto): Promise<Plant> {
    return this.plantsService.create(createPlantDto);
  }

  @Get()
  findAll(
    @Query('temporada') temporada?: string,
    @Query('nombre') nombre?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('inStock') inStock?: string
  ): Promise<Plant[]> {
    // Filtros opcionales
    if (temporada) {
      return this.plantsService.findByTemporada(temporada);
    }
    if (nombre) {
      return this.plantsService.findByName(nombre);
    }
    if (inStock === 'true') {
      return this.plantsService.findWithStock();
    }
    if (minPrice && maxPrice) {
      return this.plantsService.findByPriceRange(
        parseFloat(minPrice),
        parseFloat(maxPrice)
      );
    }
    return this.plantsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Plant> {
    return this.plantsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePlantDto: UpdatePlantDto
  ): Promise<Plant> {
    return this.plantsService.update(id, updatePlantDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.plantsService.remove(id);
  }

  @Post(':id/restar-stock')
  @HttpCode(HttpStatus.OK)
  restarStock(
    @Param('id', ParseIntPipe) id: number,
    @Body('quantity') quantity: number
  ): Promise<Plant> {
    return this.plantsService.updateStock(id, quantity);
  }
}
