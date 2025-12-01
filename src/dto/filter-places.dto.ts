import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsBoolean,
  Min,
  Max,
  IsIn,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class FilterPlacesDto {
  @ApiProperty({
    description: 'Nombre del lugar para búsqueda',
    example: 'café',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Categoría específica para filtrar',
    example: 'cafetería',
    required: false,
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({
    description: 'Etiquetas para filtrar (separadas por coma)',
    example: 'vintage,tranquilo',
    required: false,
    type: String,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map(tag => tag.trim());
    }
    return value;
  })
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({
    description: 'Latitud para búsqueda por proximidad',
    example: -12.046374,
    required: false,
    minimum: -90,
    maximum: 90,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @ApiProperty({
    description: 'Longitud para búsqueda por proximidad',
    example: -77.042793,
    required: false,
    minimum: -180,
    maximum: 180,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;

  @ApiProperty({
    description: 'Radio de búsqueda en kilómetros',
    example: 5,
    required: false,
    minimum: 0.1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0.1)
  @Max(100)
  radius?: number;

  @ApiProperty({
    description: 'Filtrar solo joyas ocultas',
    example: true,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  isHiddenGem?: boolean;

  @ApiProperty({
    description: 'Campo por el cual ordenar los resultados',
    example: 'name',
    required: false,
    enum: ['name', 'category', 'createdAt', 'distance'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['name', 'category', 'createdAt', 'distance'])
  sortBy?: string;

  @ApiProperty({
    description: 'Orden de los resultados',
    example: 'ASC',
    required: false,
    enum: ['ASC', 'DESC'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC';
}
