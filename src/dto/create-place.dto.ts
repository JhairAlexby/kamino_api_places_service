import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsArray,
  IsBoolean,
  IsUrl,
  IsInt,
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
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @ApiProperty({
    description: 'Longitud del lugar',
    example: -77.042793,
    minimum: -180,
    maximum: 180,
  })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

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
    description: 'Hora de apertura en formato HH:mm o HH:mm:ss',
    example: '08:30',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/, {
    message: 'openingTime debe estar en formato HH:mm o HH:mm:ss',
  })
  openingTime?: string;

  @ApiProperty({
    description: 'Hora de cierre en formato HH:mm o HH:mm:ss (debe ser posterior a openingTime)',
    example: '18:00',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/, {
    message: 'closingTime debe estar en formato HH:mm o HH:mm:ss',
  })
  closingTime?: string;

  @ApiProperty({
    description: 'Duración estimada del recorrido en minutos (entero positivo)',
    example: 90,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1, { message: 'tourDuration debe ser un número entero positivo' })
  tourDuration?: number;
}