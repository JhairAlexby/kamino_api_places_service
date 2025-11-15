import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsArray,
  IsBoolean,
  IsUrl,
  Min,
  Max,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreatePlaceDto {
  @ApiProperty({
    description: 'Nombre del lugar',
    example: 'Café Central',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'Descripción detallada del lugar',
    example: 'Un acogedor café en el centro de la ciudad con ambiente vintage',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Categoría principal del lugar',
    example: 'cafetería',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  category: string;

  @ApiProperty({
    description: 'Etiquetas descriptivas del lugar',
    example: ['vintage', 'tranquilo', 'instagrameable'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({
    description: 'Latitud del lugar',
    example: -12.046374,
    minimum: -90,
    maximum: 90,
  })
  @ValidateIf((o) => o.coordinates === undefined)
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @ApiProperty({
    description: 'Longitud del lugar',
    example: -77.042793,
    minimum: -180,
    maximum: 180,
  })
  @ValidateIf((o) => o.coordinates === undefined)
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;

  @ApiProperty({
    description:
      'Coordenadas en formato "latitud, longitud". Alternativa a enviar latitude y longitude por separado',
    example: '16.614497, -93.091983',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^\s*-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?\s*$/,
    { message: 'coordinates debe tener el formato "latitud, longitud"' })
  coordinates?: string;

  @ApiProperty({
    description:
      'Coordenadas en formato "latitud, longitud". Alternativa a enviar latitude y longitude por separado',
    example: '16.614497, -93.091983',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^\s*-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?\s*$/,
    { message: 'coordinates debe tener el formato "latitud, longitud"' })
  coordinates?: string;

  @ApiProperty({
    description: 'Dirección física completa del lugar',
    example: 'Av. Larco 123, Miraflores, Lima',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'URL de la imagen principal del lugar',
    example: 'https://example.com/images/cafe-central.jpg',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  imageUrl?: string;

  @ApiProperty({
    description: 'Indica si el lugar es una joya oculta',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isHiddenGem?: boolean = false;

  @ApiProperty({
    description: 'Hora de apertura (formato HH:MM o HH:MM:SS)',
    example: '08:30',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(8)
  openingTime?: string;

  @ApiProperty({
    description: 'Hora de cierre (formato HH:MM o HH:MM:SS)',
    example: '21:00',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(8)
  closingTime?: string;

  @ApiProperty({
    description: 'Duración del tour en minutos',
    example: 60,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  tourDuration?: number;
}