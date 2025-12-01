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
  ForbiddenException,
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
import { CreatePlacesBulkDto } from '../dto/create-places-bulk.dto';
import { UpdatePlaceDto } from '../dto/update-place.dto';
import { FilterPlacesDto } from '../dto/filter-places.dto';
import { PlaceResponseDto } from '../dto/place-response.dto';
import { NearbySearchDto } from '../dto/nearby-search.dto';
import { DeleteResponseDto } from '../dto/delete-response.dto';

@ApiTags('Places')
@Controller('places')
@UsePipes(new ValidationPipe({ transform: true }))
@ApiExtraModels(DeleteResponseDto)
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo lugar',
    description: 'Registra un nuevo punto de interés en la base de datos con horarios por día y días cerrados',
  })
  @ApiBody({
    type: CreatePlaceDto,
    description: 'Datos de creación del lugar',
    examples: {
      Completo: {
        summary: 'Lugar con horarios por día y días cerrados',
        value: {
          name: 'Museo Regional de Chiapas',
          description: 'Museo dedicado a la historia y cultura regional con exposiciones permanentes y temporales.',
          category: 'museo',
          tags: ['historia', 'cultura', 'educativo', 'familia'],
          latitude: 16.746079,
          longitude: -93.112507,
          address: 'Calzada de los Hombres Ilustres de la Revolución Mexicana s/n, Tuxtla Gutiérrez',
          imageUrl: 'https://ejemplo.com/imagenes/museo-chiapas.jpg',
          isHiddenGem: false,
          tourDuration: 90,
          closedDays: ['monday'],
          scheduleByDay: {
            tuesday: { open: '09:00', close: '17:00' },
            wednesday: { open: '09:00', close: '17:00' },
            thursday: { open: '09:00', close: '17:00' },
            friday: { open: '09:00', close: '17:00' },
            saturday: { open: '09:00', close: '15:00' },
            sunday: { open: '09:00', close: '15:00' }
          },
          crowdInfo: {
            peakDays: ['saturday', 'sunday'],
            peakHours: ['11:00-14:00'],
            bestDays: ['tuesday', 'wednesday', 'thursday'],
            bestHours: ['09:00-12:00', '15:00-17:00']
          }
        }
      },
      Basico: {
        summary: 'Solo campos básicos obligatorios',
        value: {
          name: 'Parque Central',
          description: 'Hermoso parque en el corazón de la ciudad, ideal para paseos en familia.',
          category: 'parque',
          tags: ['naturaleza', 'familia', 'deporte'],
          latitude: 16.800000,
          longitude: -93.100000,
          address: 'Avenida Central S/N, Col. Centro, Tuxtla Gutiérrez',
          isHiddenGem: false
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Lugar creado exitosamente',
    type: PlaceResponseDto,
    content: {
      'application/json': {
        example: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Museo Regional de Chiapas',
          description: 'Museo dedicado a la historia y cultura regional.',
          category: 'museo',
          tags: ['historia', 'cultura', 'educativo', 'familia'],
          latitude: 16.746079,
          longitude: -93.112507,
          address: 'Calzada de los Hombres Ilustres de la Revolución Mexicana s/n, Tuxtla Gutiérrez',
          imageUrl: 'https://ejemplo.com/imagenes/museo-chiapas.jpg',
          isHiddenGem: false,
          openingTime: null,
          closingTime: null,
          tourDuration: 90,
          narrativeStoreId: null,
          narrativeDocumentId: null,
          hasNarrative: false,
          closedDays: ['monday'],
          scheduleByDay: {
            tuesday: { open: '09:00', close: '17:00' },
            wednesday: { open: '09:00', close: '17:00' },
            thursday: { open: '09:00', close: '17:00' },
            friday: { open: '09:00', close: '17:00' },
            saturday: { open: '09:00', close: '15:00' },
            sunday: { open: '09:00', close: '15:00' }
          },
          crowdInfo: {
            peakDays: ['saturday', 'sunday'],
            peakHours: ['11:00-14:00'],
            bestDays: ['tuesday', 'wednesday', 'thursday'],
            bestHours: ['09:00-12:00', '15:00-17:00']
          },
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z'
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  async create(@Body() createPlaceDto: CreatePlaceDto): Promise<PlaceResponseDto> {
    return this.placesService.create(createPlaceDto);
  }

  @Post('bulk')
  @ApiOperation({
    summary: 'Crear múltiples lugares',
    description: 'Registra varios puntos de interés en la base de datos en una sola petición',
  })
  @ApiBody({
    type: CreatePlacesBulkDto,
    description: 'Datos de creación de múltiples lugares',
    examples: {
      'Crear 2 lugares': {
        summary: 'Ejemplo con 2 lugares',
        value: {
          places: [
            {
              name: 'Café Central',
              description: 'Un acogedor café en el centro de la ciudad',
              category: 'cafetería',
              tags: ['vintage', 'tranquilo'],
              latitude: -12.046374,
              longitude: -77.042793,
              address: 'Av. Larco 123, Miraflores, Lima',
              imageUrl: 'https://example.com/images/cafe.jpg',
              isHiddenGem: false
            },
            {
              name: 'Museo de Historia',
              description: 'Exhibiciones de historia local',
              category: 'museo',
              tags: ['educativo', 'familiar'],
              latitude: -12.045374,
              longitude: -77.043793,
              address: 'Av. Principal 456',
              imageUrl: 'https://example.com/museo.jpg',
              isHiddenGem: false,
              openingTime: '09:00',
              closingTime: '18:00',
              tourDuration: 90
            }
          ]
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Lugares creados exitosamente',
    content: {
      'application/json': {
        example: {
          success: true,
          statusCode: 201,
          message: 'Lugares creados exitosamente',
          data: {
            created: 2,
            failed: 0,
            results: [
              {
                id: '123e4567-e89b-12d3-a456-426614174000',
                name: 'Café Central',
                status: 'created'
              },
              {
                id: '223e4567-e89b-12d3-a456-426614174001',
                name: 'Museo de Historia',
                status: 'created'
              }
            ]
          },
          timestamp: '2024-01-15T10:30:00Z'
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  @ApiResponse({
    status: 413,
    description: 'Demasiados lugares en la petición (máximo 100)',
  })
  async createBulk(@Body() createPlacesBulkDto: CreatePlacesBulkDto): Promise<any> {
    return this.placesService.createBulk(createPlacesBulkDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener lugares con filtros',
    description: 'Busca y filtra lugares según diversos criterios SIN paginación',
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
  @ApiResponse({
    status: 200,
    description: 'Lista de lugares obtenida exitosamente',
    type: [PlaceResponseDto],
    content: {
      'application/json': {
        example: [
          {
            id: '11111111-1111-1111-1111-111111111111',
            name: 'Café Central',
            description: 'Un acogedor café en el centro de la ciudad',
            category: 'cafetería',
            tags: ['vintage', 'tranquilo'],
            latitude: -12.046374,
            longitude: -77.042793,
            address: 'Av. Larco 123, Miraflores, Lima',
            imageUrl: 'https://example.com/images/cafe.jpg',
            isHiddenGem: false,
            openingTime: '08:30',
            closingTime: '21:00',
            tourDuration: 60,
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: '2024-01-15T10:30:00Z'
          }
        ]
      }
    }
  })
  async findAll(@Query() filterDto: FilterPlacesDto): Promise<PlaceResponseDto[]> {
    return this.placesService.findAll(filterDto);
  }

  @Post('nearby')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Buscar lugares cercanos',
    description: 'Encuentra lugares cercanos a coordenadas específicas usando datos JSON',
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
    content: {
      'application/json': {
        example: ['cafetería', 'museo', 'parque']
      }
    }
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
    content: {
      'application/json': {
        example: ['vintage', 'tranquilo', 'familiar', 'educativo']
      }
    }
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
    content: {
      'application/json': {
        example: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Museo de Historia',
          description: 'Exhibiciones de historia local',
          category: 'museo',
          tags: ['educativo', 'familiar'],
          latitude: -12.046374,
          longitude: -77.042793,
          address: 'Av. Principal 123',
          imageUrl: 'https://example.com/museo.jpg',
          isHiddenGem: false,
          openingTime: '09:00',
          closingTime: '18:00',
          tourDuration: 90,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z'
        }
      }
    }
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
      'Marcar como joya oculta': {
        summary: 'Solo isHiddenGem',
        value: {
          isHiddenGem: true,
        },
      },
      'Actualizar horario y tour': {
        summary: 'Modificar openingTime, closingTime y tourDuration',
        value: {
          openingTime: '10:00',
          closingTime: '19:30',
          tourDuration: 75
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Lugar actualizado exitosamente',
    type: PlaceResponseDto,
    content: {
      'application/json': {
        example: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Museo de Historia',
          description: 'Exhibiciones de historia local',
          category: 'museo',
          tags: ['educativo', 'familiar'],
          latitude: -12.046374,
          longitude: -77.042793,
          address: 'Av. Principal 123',
          imageUrl: 'https://example.com/museo.jpg',
          isHiddenGem: true,
          openingTime: '10:00',
          closingTime: '19:30',
          tourDuration: 75,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-16T09:00:00Z'
        }
      }
    }
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

  @Delete('admin/complete-delete-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Eliminar TODOS los lugares (ADMIN TEMPORAL)',
    description:
      'Elimina físicamente todos los registros de lugares en la base de datos. Disponible temporalmente y debe habilitarse con la variable de entorno `ALLOW_ADMIN_DELETE_ALL=true`. No permitida en producción.',
  })
  @ApiOkResponse({
    description: 'Todos los lugares eliminados exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'integer', example: 200 },
        message: { type: 'string', example: 'Recurso eliminado exitosamente' },
        data: {
          type: 'object',
          properties: {
            deletedCount: { type: 'integer', example: 42 },
          },
        },
        timestamp: { type: 'string', format: 'date-time', example: '2024-08-29T12:34:56.000Z' },
      },
    },
  })
  @ApiResponse({ status: 403, description: 'Operación no permitida' })
  async adminCompleteDeleteAll(): Promise<{ deletedCount: number }> {
    if (process.env.NODE_ENV === 'production') {
      throw new ForbiddenException('Operación no permitida en producción');
    }
    if (process.env.ALLOW_ADMIN_DELETE_ALL !== 'true') {
      throw new ForbiddenException('Operación no habilitada');
    }
    return this.placesService.completeDeleteAll();
  }
}
