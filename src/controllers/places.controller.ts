import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ValidationPipe,
  UsePipes,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { PlacesService } from '../services/places.service';
import { CreatePlaceDto } from '../dto/create-place.dto';
import { UpdatePlaceDto } from '../dto/update-place.dto';
import { FilterPlacesDto } from '../dto/filter-places.dto';
import { PlaceResponseDto } from '../dto/place-response.dto';
import { PaginatedResponseDto } from '../dto/paginated-response.dto';

@ApiTags('Places')
@Controller('places')
@UsePipes(new ValidationPipe({ transform: true }))
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo lugar',
    description: 'Registra un nuevo punto de interés en la base de datos',
  })
  @ApiBody({ type: CreatePlaceDto })
  @ApiResponse({
    status: 201,
    description: 'Lugar creado exitosamente',
    type: PlaceResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  async create(@Body() createPlaceDto: CreatePlaceDto): Promise<PlaceResponseDto> {
    return this.placesService.create(createPlaceDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener lugares con filtros',
    description: 'Busca y filtra lugares según diversos criterios con paginación',
  })
  @ApiQuery({ name: 'search', required: false, description: 'Búsqueda por nombre' })
  @ApiQuery({ name: 'category', required: false, description: 'Filtrar por categoría' })
  @ApiQuery({ name: 'tags', required: false, description: 'Filtrar por etiquetas (separadas por coma)' })
  @ApiQuery({ name: 'latitude', required: false, description: 'Latitud para búsqueda por proximidad' })
  @ApiQuery({ name: 'longitude', required: false, description: 'Longitud para búsqueda por proximidad' })
  @ApiQuery({ name: 'radius', required: false, description: 'Radio de búsqueda en kilómetros' })
  @ApiQuery({ name: 'isHiddenGem', required: false, description: 'Filtrar solo joyas ocultas' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Campo de ordenamiento' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Orden (ASC/DESC)' })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, description: 'Elementos por página' })
  @ApiResponse({
    status: 200,
    description: 'Lista de lugares obtenida exitosamente',
    type: PaginatedResponseDto,
  })
  async findAll(@Query() filterDto: FilterPlacesDto): Promise<PaginatedResponseDto<PlaceResponseDto>> {
    return this.placesService.findAll(filterDto);
  }

  @Get('nearby')
  @ApiOperation({
    summary: 'Buscar lugares cercanos',
    description: 'Encuentra lugares cercanos a coordenadas específicas',
  })
  @ApiQuery({ name: 'latitude', required: true, description: 'Latitud de referencia' })
  @ApiQuery({ name: 'longitude', required: true, description: 'Longitud de referencia' })
  @ApiQuery({ name: 'radius', required: false, description: 'Radio de búsqueda en kilómetros (por defecto: 5)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Número máximo de resultados (por defecto: 10)' })
  @ApiResponse({
    status: 200,
    description: 'Lugares cercanos encontrados',
    type: [PlaceResponseDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Parámetros de coordenadas inválidos',
  })
  async findNearby(
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
    @Query('radius') radius?: number,
    @Query('limit') limit?: number,
  ): Promise<PlaceResponseDto[]> {
    return this.placesService.findNearby(
      Number(latitude),
      Number(longitude),
      radius ? Number(radius) : 5,
      limit ? Number(limit) : 10,
    );
  }

  @Get('categories')
  @ApiOperation({
    summary: 'Obtener todas las categorías',
    description: 'Retorna una lista de todas las categorías disponibles',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorías obtenida exitosamente',
    type: [String],
  })
  async getCategories(): Promise<string[]> {
    return this.placesService.getCategories();
  }

  @Get('tags')
  @ApiOperation({
    summary: 'Obtener todas las etiquetas',
    description: 'Retorna una lista de todas las etiquetas disponibles',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de etiquetas obtenida exitosamente',
    type: [String],
  })
  async getTags(): Promise<string[]> {
    return this.placesService.getTags();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un lugar por ID',
    description: 'Busca un lugar específico por su identificador único',
  })
  @ApiParam({ name: 'id', description: 'ID único del lugar' })
  @ApiResponse({
    status: 200,
    description: 'Lugar encontrado exitosamente',
    type: PlaceResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Lugar no encontrado',
  })
  async findOne(@Param('id') id: string): Promise<PlaceResponseDto> {
    return this.placesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un lugar',
    description: 'Actualiza la información de un lugar existente',
  })
  @ApiParam({ name: 'id', description: 'ID único del lugar' })
  @ApiBody({ type: UpdatePlaceDto })
  @ApiResponse({
    status: 200,
    description: 'Lugar actualizado exitosamente',
    type: PlaceResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Lugar no encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  async update(
    @Param('id') id: string,
    @Body() updatePlaceDto: UpdatePlaceDto,
  ): Promise<PlaceResponseDto> {
    return this.placesService.update(id, updatePlaceDto);
  }

  @Patch(':id/toggle-hidden-gem')
  @ApiOperation({
    summary: 'Alternar estado de joya oculta',
    description: 'Cambia el estado de "joya oculta" de un lugar',
  })
  @ApiParam({ name: 'id', description: 'ID único del lugar' })
  @ApiResponse({
    status: 200,
    description: 'Estado de joya oculta actualizado exitosamente',
    type: PlaceResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Lugar no encontrado',
  })
  async toggleHiddenGem(@Param('id') id: string): Promise<PlaceResponseDto> {
    return this.placesService.toggleHiddenGem(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar un lugar',
    description: 'Elimina un lugar de la base de datos',
  })
  @ApiParam({ name: 'id', description: 'ID único del lugar' })
  @ApiResponse({
    status: 204,
    description: 'Lugar eliminado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Lugar no encontrado',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.placesService.remove(id);
  }
}