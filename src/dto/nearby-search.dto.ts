import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class NearbySearchDto {
  @ApiProperty({
    description: 'Latitud de referencia para la búsqueda',
    example: -12.0464,
    minimum: -90,
    maximum: 90,
  })
  @IsNumber({}, { message: 'La latitud debe ser un número válido' })
  @Min(-90, { message: 'La latitud debe estar entre -90 y 90 grados' })
  @Max(90, { message: 'La latitud debe estar entre -90 y 90 grados' })
  @Type(() => Number)
  latitude: number;

  @ApiProperty({
    description: 'Longitud de referencia para la búsqueda',
    example: -77.0428,
    minimum: -180,
    maximum: 180,
  })
  @IsNumber({}, { message: 'La longitud debe ser un número válido' })
  @Min(-180, { message: 'La longitud debe estar entre -180 y 180 grados' })
  @Max(180, { message: 'La longitud debe estar entre -180 y 180 grados' })
  @Type(() => Number)
  longitude: number;

  @ApiProperty({
    description: 'Radio de búsqueda en kilómetros',
    example: 5,
    default: 5,
    minimum: 0.1,
    maximum: 100,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'El radio debe ser un número válido' })
  @Min(0.1, { message: 'El radio mínimo es 0.1 kilómetros' })
  @Max(100, { message: 'El radio máximo es 100 kilómetros' })
  @Type(() => Number)
  radius?: number = 5;

  @ApiProperty({
    description: 'Número máximo de resultados a retornar',
    example: 10,
    default: 10,
    minimum: 1,
    maximum: 100,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'El límite debe ser un número válido' })
  @Min(1, { message: 'El límite mínimo es 1' })
  @Max(100, { message: 'El límite máximo es 100' })
  @Type(() => Number)
  limit?: number = 10;

  @ApiProperty({
    description: 'Filtrar por hora de apertura (formato HH:MM:SS)',
    example: '09:00:00',
    required: false,
  })
  @IsOptional()
  openingTime?: string;

  @ApiProperty({
    description: 'Filtrar por hora de cierre (formato HH:MM:SS)',
    example: '18:00:00',
    required: false,
  })
  @IsOptional()
  closingTime?: string;

  @ApiProperty({
    description: 'Duración mínima de tour en minutos',
    example: 60,
    required: false,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber({}, { message: 'La duración mínima debe ser un número válido' })
  @Min(1, { message: 'La duración mínima debe ser al menos 1 minuto' })
  @Type(() => Number)
  minTourDuration?: number;

  @ApiProperty({
    description: 'Duración máxima de tour en minutos',
    example: 240,
    required: false,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber({}, { message: 'La duración máxima debe ser un número válido' })
  @Min(1, { message: 'La duración máxima debe ser al menos 1 minuto' })
  @Type(() => Number)
  maxTourDuration?: number;
}