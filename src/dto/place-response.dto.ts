import { ApiProperty } from '@nestjs/swagger';
import { Place } from '../entities/place.entity';

export class PlaceResponseDto {
  @ApiProperty({
    description: 'ID único del lugar',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre del lugar',
    example: 'Café Central',
  })
  name: string;

  @ApiProperty({
    description: 'Descripción del lugar',
    example: 'Un acogedor café en el centro de la ciudad',
  })
  description: string;

  @ApiProperty({
    description: 'Categoría del lugar',
    example: 'cafetería',
  })
  category: string;

  @ApiProperty({
    description: 'Etiquetas del lugar',
    example: ['vintage', 'tranquilo'],
    type: [String],
  })
  tags: string[];

  @ApiProperty({
    description: 'Latitud del lugar',
    example: -12.046374,
  })
  latitude: number;

  @ApiProperty({
    description: 'Longitud del lugar',
    example: -77.042793,
  })
  longitude: number;

  @ApiProperty({
    description: 'Dirección del lugar',
    example: 'Av. Larco 123, Miraflores, Lima',
  })
  address: string;

  @ApiProperty({
    description: 'URL de la imagen principal',
    example: 'https://example.com/images/cafe.jpg',
    nullable: true,
  })
  imageUrl: string | null;

  @ApiProperty({
    description: 'Indica si es una joya oculta',
    example: false,
  })
  isHiddenGem: boolean;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2024-01-15T10:30:00Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Hora de apertura del lugar',
    example: '08:00:00',
    nullable: true,
  })
  openingTime: string | null;

  @ApiProperty({
    description: 'Hora de cierre del lugar',
    example: '22:00:00',
    nullable: true,
  })
  closingTime: string | null;

  @ApiProperty({
    description: 'Duración estimada del tour en minutos',
    example: 120,
    nullable: true,
  })
  tourDuration: number | null;

  @ApiProperty({
    description: 'Distancia en kilómetros (solo en búsquedas por proximidad)',
    example: 2.5,
    required: false,
  })
  distance?: number;

  constructor(place: Place, distance?: number) {
    this.id = place.id;
    this.name = place.name;
    this.description = place.description;
    this.category = place.category;
    this.tags = place.tags || [];
    this.latitude = Number(place.latitude);
    this.longitude = Number(place.longitude);
    this.address = place.address;
    this.imageUrl = place.imageUrl;
    this.isHiddenGem = place.isHiddenGem;
    this.createdAt = place.createdAt;
    this.updatedAt = place.updatedAt;
    this.openingTime = place.openingTime;
    this.closingTime = place.closingTime;
    this.tourDuration = place.tourDuration;
    if (distance !== undefined) {
      this.distance = Math.round(distance * 100) / 100; // Redondear a 2 decimales
    }
  }
}