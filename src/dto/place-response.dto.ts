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
    description: 'Hora de apertura (formato HH:MM o HH:MM:SS)',
    example: '08:30',
    required: false,
    nullable: true,
  })
  openingTime?: string | null;

  @ApiProperty({
    description: 'Hora de cierre (formato HH:MM o HH:MM:SS)',
    example: '21:00',
    required: false,
    nullable: true,
  })
  closingTime?: string | null;

  @ApiProperty({
    description: 'Duración del tour en minutos',
    example: 60,
    required: false,
    nullable: true,
  })
  tourDuration?: number | null;

  @ApiProperty({
    description: 'ID del File Search Store donde está almacenada la narrativa',
    example: 'fileSearchStores/abc123xyz456',
    required: false,
    nullable: true,
  })
  narrativeStoreId?: string | null;

  @ApiProperty({
    description: 'ID del documento de narrativa en Gemini File Search',
    example: 'fileSearchStores/abc123xyz456/documents/doc789',
    required: false,
    nullable: true,
  })
  narrativeDocumentId?: string | null;

  @ApiProperty({
    description: 'Indica si el lugar tiene narrativa asociada',
    example: true,
  })
  hasNarrative: boolean;

  @ApiProperty({
    description: 'Días en los que el lugar está cerrado',
    example: ['monday', 'sunday'],
    required: false,
    nullable: true
  })
  closedDays?: string[] | null;

  @ApiProperty({
    description: 'Horarios específicos por día',
    example: {
      tuesday: { open: '09:30', close: '16:00' },
      saturday: { open: '10:30', close: '16:00' }
    },
    required: false,
    nullable: true,
  })
  scheduleByDay?: Record<string, { open: string; close: string }> | null;

  @ApiProperty({
    description: 'Información sobre afluencia y horarios óptimos',
    example: {
      peakDays: ['saturday', 'sunday'],
      peakHours: ['11:00-13:00'],
      bestDays: ['tuesday', 'wednesday', 'thursday'],
      bestHours: ['09:30-11:00', '14:00-16:00']
    },
    required: false,
    nullable: true,
  })
  crowdInfo?: {
    peakDays?: string[];
    peakHours?: string[];
    bestDays?: string[];
    bestHours?: string[];
  } | null;

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
    this.openingTime = place.openingTime ?? null;
    this.closingTime = place.closingTime ?? null;
    this.tourDuration = place.tourDuration ?? null;

    this.narrativeStoreId = place.narrativeStoreId ?? null;
    this.narrativeDocumentId = place.narrativeDocumentId ?? null;
    this.hasNarrative = !!place.narrativeDocumentId;

    this.closedDays = place.closedDays ?? null;
    this.scheduleByDay = place.scheduleByDay ?? null;
    this.crowdInfo = place.crowdInfo ?? null;

    this.createdAt = place.createdAt;
    this.updatedAt = place.updatedAt;
    if (distance !== undefined) {
      this.distance = Math.round(distance * 100) / 100;
    }
  }
}
