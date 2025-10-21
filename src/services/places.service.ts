import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Place } from '../entities/place.entity';
import { CreatePlaceDto } from '../dto/create-place.dto';
import { UpdatePlaceDto } from '../dto/update-place.dto';
import { FilterPlacesDto } from '../dto/filter-places.dto';
import { PlaceResponseDto } from '../dto/place-response.dto';
import { PaginatedResponseDto, PaginationMetaDto } from '../dto/paginated-response.dto';
import { NearbySearchDto } from '../dto/nearby-search.dto';

@Injectable()
export class PlacesService {
  constructor(
    @InjectRepository(Place)
    private readonly placeRepository: Repository<Place>,
  ) {}

  async create(createPlaceDto: CreatePlaceDto): Promise<PlaceResponseDto> {
    const place = this.placeRepository.create(createPlaceDto);
    const savedPlace = await this.placeRepository.save(place);
    return new PlaceResponseDto(savedPlace);
  }

  async findAll(filterDto: FilterPlacesDto): Promise<PaginatedResponseDto<PlaceResponseDto>> {
    const {
      search,
      category,
      tags,
      latitude,
      longitude,
      radius,
      isHiddenGem,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      page = 1,
      limit = 10,
    } = filterDto;

    const queryBuilder = this.placeRepository.createQueryBuilder('place');

    // Búsqueda por nombre
    if (search) {
      queryBuilder.andWhere('LOWER(place.name) LIKE LOWER(:search)', {
        search: `%${search}%`,
      });
    }

    // Filtro por categoría
    if (category) {
      queryBuilder.andWhere('LOWER(place.category) = LOWER(:category)', {
        category,
      });
    }

    // Filtro por etiquetas
    if (tags && tags.length > 0) {
      const tagConditions = tags.map((tag, index) => {
        queryBuilder.setParameter(`tag${index}`, `%${tag.toLowerCase()}%`);
        return `LOWER(array_to_string(place.tags, ',')) LIKE :tag${index}`;
      });
      queryBuilder.andWhere(`(${tagConditions.join(' AND ')})`);
    }

    // Filtro por joya oculta
    if (isHiddenGem !== undefined) {
      queryBuilder.andWhere('place.isHiddenGem = :isHiddenGem', {
        isHiddenGem,
      });
    }

    // Búsqueda por proximidad
    let hasProximitySearch = false;
    if (latitude !== undefined && longitude !== undefined && radius !== undefined) {
      hasProximitySearch = true;
      queryBuilder.addSelect(
        `(6371 * acos(cos(radians(:latitude)) * cos(radians(place.latitude)) * cos(radians(place.longitude) - radians(:longitude)) + sin(radians(:latitude)) * sin(radians(place.latitude))))`,
        'distance'
      );
      queryBuilder.setParameters({ latitude, longitude });
      queryBuilder.andWhere(
        `(6371 * acos(cos(radians(:latitude)) * cos(radians(place.latitude)) * cos(radians(place.longitude) - radians(:longitude)) + sin(radians(:latitude)) * sin(radians(place.latitude)))) <= :radius`,
        { radius }
      );
    }

    // Ordenamiento
    if (sortBy === 'distance' && hasProximitySearch) {
      queryBuilder.orderBy('distance', sortOrder);
    } else {
      const validSortFields = ['name', 'category', 'createdAt'];
      const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
      queryBuilder.orderBy(`place.${sortField}`, sortOrder);
    }

    // Paginación
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    // Ejecutar consulta
    const [places, total] = await queryBuilder.getManyAndCount();

    // Procesar resultados
    const placesWithDistance = await Promise.all(
      places.map(async (place) => {
        let distance: number | undefined;
        if (hasProximitySearch) {
          distance = this.calculateDistance(
            latitude!,
            longitude!,
            Number(place.latitude),
            Number(place.longitude)
          );
        }
        return new PlaceResponseDto(place, distance);
      })
    );

    // Metadatos de paginación
    const totalPages = Math.ceil(total / limit);
    const meta: PaginationMetaDto = {
      page,
      limit,
      total,
      totalPages,
      hasPrevious: page > 1,
      hasNext: page < totalPages,
    };

    return new PaginatedResponseDto(placesWithDistance, meta);
  }

  async findOne(id: string): Promise<PlaceResponseDto> {
    const place = await this.placeRepository.findOne({ where: { id } });
    if (!place) {
      throw new NotFoundException(`Lugar con ID ${id} no encontrado`);
    }
    return new PlaceResponseDto(place);
  }

  async update(id: string, updatePlaceDto: UpdatePlaceDto): Promise<PlaceResponseDto> {
    const place = await this.placeRepository.findOne({ where: { id } });
    if (!place) {
      throw new NotFoundException(`Lugar con ID ${id} no encontrado`);
    }

    Object.assign(place, updatePlaceDto);
    const updatedPlace = await this.placeRepository.save(place);
    return new PlaceResponseDto(updatedPlace);
  }

  async remove(id: string): Promise<void> {
    const result = await this.placeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Lugar con ID ${id} no encontrado`);
    }
  }

  // Sobrecarga para aceptar DTO
  async findNearby(nearbySearchDto: NearbySearchDto): Promise<PlaceResponseDto[]>;
  // Sobrecarga para mantener compatibilidad con parámetros individuales
  async findNearby(
    latitude: number,
    longitude: number,
    radius?: number,
    limit?: number
  ): Promise<PlaceResponseDto[]>;
  // Implementación
  async findNearby(
    latitudeOrDto: number | NearbySearchDto,
    longitude?: number,
    radius: number = 5,
    limit: number = 10
  ): Promise<PlaceResponseDto[]> {
    let latitude: number;
    
    // Determinar si se pasó un DTO o parámetros individuales
    if (typeof latitudeOrDto === 'object') {
      const dto = latitudeOrDto as NearbySearchDto;
      latitude = dto.latitude;
      longitude = dto.longitude;
      radius = dto.radius || 5;
      limit = dto.limit || 10;
    } else {
      latitude = latitudeOrDto;
      longitude = longitude!;
    }
    if (radius <= 0 || radius > 100) {
      throw new BadRequestException('El radio debe estar entre 0.1 y 100 kilómetros');
    }

    const queryBuilder = this.placeRepository
      .createQueryBuilder('place')
      .addSelect(
        `(6371 * acos(cos(radians(:latitude)) * cos(radians(place.latitude)) * cos(radians(place.longitude) - radians(:longitude)) + sin(radians(:latitude)) * sin(radians(place.latitude))))`,
        'distance'
      )
      .setParameters({ latitude, longitude })
      .where(
        `(6371 * acos(cos(radians(:latitude)) * cos(radians(place.latitude)) * cos(radians(place.longitude) - radians(:longitude)) + sin(radians(:latitude)) * sin(radians(place.latitude)))) <= :radius`,
        { radius }
      )
      .orderBy('distance', 'ASC')
      .limit(limit);

    const places = await queryBuilder.getMany();

    return places.map((place) => {
      const distance = this.calculateDistance(
        latitude,
        longitude,
        Number(place.latitude),
        Number(place.longitude)
      );
      return new PlaceResponseDto(place, distance);
    });
  }

  async toggleHiddenGem(id: string): Promise<PlaceResponseDto> {
    const place = await this.placeRepository.findOne({ where: { id } });
    if (!place) {
      throw new NotFoundException(`Lugar con ID ${id} no encontrado`);
    }

    place.isHiddenGem = !place.isHiddenGem;
    const updatedPlace = await this.placeRepository.save(place);
    return new PlaceResponseDto(updatedPlace);
  }

  async getCategories(): Promise<string[]> {
    const result = await this.placeRepository
      .createQueryBuilder('place')
      .select('DISTINCT place.category', 'category')
      .orderBy('place.category', 'ASC')
      .getRawMany();

    return result.map(item => item.category);
  }

  async getTags(): Promise<string[]> {
    const result = await this.placeRepository
      .createQueryBuilder('place')
      .select('place.tags', 'tags')
      .getMany();

    const allTags = new Set<string>();
    result.forEach(place => {
      if (place.tags) {
        place.tags.forEach(tag => allTags.add(tag));
      }
    });

    return Array.from(allTags).sort();
  }

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Radio de la Tierra en kilómetros
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}