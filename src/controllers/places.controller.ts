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
  ApiOkResponse,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import { PlacesService } from '../services/places.service';
import { CreatePlaceDto } from '../dto/create-place.dto';
import { UpdatePlaceDto } from '../dto/update-place.dto';
import { FilterPlacesDto } from '../dto/filter-places.dto';
import { PlaceResponseDto } from '../dto/place-response.dto';
import { PaginatedResponseDto } from '../dto/paginated-response.dto';
import { NearbySearchDto } from '../dto/nearby-search.dto';
import { DeleteResponseDto } from '../dto/delete-response.dto';

@ApiTags('Places')
@Controller('places')
@UsePipes(new ValidationPipe({ transform: true }))
// En la clase PlacesController
@ApiExtraModels(DeleteResponseDto)
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo lugar',
    description: 'Registra un nuevo punto de interés en la base de datos con información de horarios y duración de tour',
  })
  @ApiBody({ 
    type: CreatePlaceDto,
    examples: {
      'Lugar con horarios': {
        summary: 'Ejemplo completo con horarios de apertura',
        value: {
          name: 'Museo de Arte',
          description: 'Museo de arte contemporáneo con exposiciones permanentes y temporales',
          category: 'museo',
          tags: ['arte', 'cultura', 'familia'],
          latitude: -12.0464,
          longitude: -77.0428,
          address: 'Av. 9 de Julio 123, Lima',
          openingTime: '09:00:00',
          closingTime: '18:00:00',
          tourDuration: 120,
          isHiddenGem: false
        }
      },
      'Restaurante nocturno': {
        summary: 'Restaurante con horario extendido',
        value: {
          name: 'Restaurante Central',
          description: 'Restaurante de alta cocina con menú degustación',
          category: 'restaurante',
          tags: ['gourmet', 'romántico', 'celebraciones'],
          latitude: -12.1219,
          longitude: -77.0297,
          address: 'Calle Central 456, Miraflores',
          openingTime: '19:00:00',
          closingTime: '23:30:00',
          tourDuration: 180,
          isHiddenGem: true
        }
      }
    }
  })
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
    description: 'Busca y filtra lugares según diversos criterios con paginación, incluyendo horarios de apertura',
  })
  @ApiQuery({ name: 'search', required: false, description: 'Búsqueda por nombre' })
  @ApiQuery({ name: 'category', required: false, description: 'Filtrar por categoría' })
  @ApiQuery({ name: 'tags', required: false, description: 'Filtrar por etiquetas (separadas por coma)' })
  @ApiQuery({ name: 'latitude', required: false, description: 'Latitud para búsqueda por proximidad' })
  @ApiQuery({ name: 'longitude', required: false, description: 'Longitud para búsqueda por proximidad' })
  @ApiQuery({ name: 'radius', required: false, description: 'Radio de búsqueda en kilómetros' })
  @ApiQuery({ name: 'isHiddenGem', required: false, description: 'Filtrar solo joyas ocultas' })
  @ApiQuery({ name: 'openingTime', required: false, description: 'Filtrar por hora de apertura (HH:MM:SS)' })
  @ApiQuery({ name: 'closingTime', required: false, description: 'Filtrar por hora de cierre (HH:MM:SS)' })
  @ApiQuery({ name: 'minTourDuration', required: false, description: 'Duración mínima de tour en minutos' })
  @ApiQuery({ name: 'maxTourDuration', required: false, description: 'Duración máxima de tour en minutos' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Campo de ordenamiento (name, category, openingTime, closingTime, tourDuration, createdAt)' })
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

  @Post('nearby')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Buscar lugares cercanos',
    description: 'Encuentra lugares cercanos a coordenadas específicas usando datos JSON, con opción de filtrar por horarios',
  })
  @ApiBody({ 
    type: NearbySearchDto,
    description: 'Datos de búsqueda de lugares cercanos',
    examples: {
      'Lima Centro': {
        summary: 'Búsqueda en Lima Centro',
        value: {
          latitude: -12.0464,
          longitude: -77.0428,
          radius: 5,
          limit: 10
        }
      },
      'Miraflores': {
        summary: 'Búsqueda en Miraflores',
        value: {
          latitude: -12.1219,
          longitude: -77.0297,
          radius: 10,
          limit: 20
        }
      },
      'Museos abiertos por la mañana': {
        summary: 'Filtrar por horario de apertura',
        value: {
          latitude: -12.0464,
          longitude: -77.0428,
          radius: 3,
          openingTime: '09:00:00',
          limit: 15
        }
      }
    }
  })
  @ApiExtraModels(PlaceResponseDto)
  @ApiResponse({
    status: 200,
    description: 'Lugares cercanos encontrados exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Datos obtenidos exitosamente' },
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(PlaceResponseDto) }
        },
        timestamp: { type: 'string', example: '2024-01-15T10:30:00Z' }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos o coordenadas fuera de rango',
  })
  async findNearby(
    @Body() nearbySearchDto: NearbySearchDto,
  ): Promise<PlaceResponseDto[]> {
    return this.placesService.findNearby(nearbySearchDto);
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

  @Get('available-now')
  @ApiOperation({
    summary: 'Obtener lugares abiertos actualmente',
    description: 'Retorna lugares que están abiertos en el horario actual',
  })
  @ApiQuery({ name: 'category', required: false, description: 'Filtrar por categoría' })
  @ApiQuery({ name: 'radius', required: false, description: 'Radio de búsqueda en kilómetros (requiere latitud y longitud)' })
  @ApiQuery({ name: 'latitude', required: false, description: 'Latitud para búsqueda por proximidad' })
  @ApiQuery({ name: 'longitude', required: false, description: 'Longitud para búsqueda por proximidad' })
  @ApiQuery({ name: 'limit', required: false, description: 'Número máximo de resultados' })
  @ApiResponse({
    status: 200,
    description: 'Lista de lugares abiertos actualmente',
    type: [PlaceResponseDto],
  })
  async getAvailableNow(
    @Query('category') category?: string,
    @Query('radius') radius?: number,
    @Query('latitude') latitude?: number,
    @Query('longitude') longitude?: number,
    @Query('limit') limit?: number,
  ): Promise<PlaceResponseDto[]> {
    return this.placesService.getAvailableNow({
      category,
      radius,
      latitude,
      longitude,
      limit: limit || 20,
    });
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un lugar por ID',
    description: 'Busca un lugar específico por su identificador único, incluyendo información de horarios y duración de tour',
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
    description: 'Actualiza la información de un lugar existente, incluyendo horarios y duración de tour',
  })
  @ApiParam({ name: 'id', description: 'ID único del lugar' })
  @ApiBody({
    type: UpdatePlaceDto,
    description: 'Campos opcionales para actualización del lugar',
    examples: {
      'Actualización básica': {
        summary: 'Nombre y descripción',
        value: {
          name: 'Café Central Renovado',
          description: 'Un acogedor café renovado en el centro de la ciudad',
        },
      },
      'Actualizar horarios': {
        summary: 'Cambiar horario de apertura y cierre',
        value: {
          openingTime: '08:30:00',
          closingTime: '22:00:00',
          tourDuration: 90
        },
      },
      'Marcar como joya oculta': {
        summary: 'Solo isHiddenGem',
        value: {
          isHiddenGem: true,
        },
      },
      'Actualización completa': {
        summary: 'Todos los campos',
        value: {
          name: 'Restaurante Central - Nueva Temporada',
          description: 'Experiencia gastronómica única con menú degustación actualizado',
          category: 'restaurante',
          tags: ['gourmet', 'temporada', 'experiencia'],
          openingTime: '19:30:00',
          closingTime: '23:00:00',
          tourDuration: 150,
          isHiddenGem: true
        },
      },
    },
  })
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

  // Dentro de PlacesController.remove()
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Eliminar un lugar',
    description: 'Elimina un lugar de la base de datos (borrado lógico)',
  })
  @ApiParam({ name: 'id', description: 'ID único del lugar' })
  @ApiOkResponse({
    description: 'Lugar eliminado exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'integer', example: 200 },
        message: { type: 'string', example: 'Recurso eliminado exitosamente' },
        data: { $ref: getSchemaPath(DeleteResponseDto) },
        timestamp: { type: 'string', format: 'date-time', example: '2024-08-29T12:34:56.000Z' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Lugar no encontrado',
  })
  async remove(@Param('id') id: string): Promise<DeleteResponseDto> {
    return this.placesService.remove(id);
  }
}