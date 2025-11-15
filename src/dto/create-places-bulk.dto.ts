import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  ValidateNested,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePlaceDto } from './create-place.dto';

export class CreatePlacesBulkDto {
  @ApiProperty({
    description: 'Array de lugares a crear',
    type: [CreatePlaceDto],
    minItems: 1,
    maxItems: 100,
    example: [
      {
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
        tourDuration: 60
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
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePlaceDto)
  @ArrayMinSize(1, { message: 'Debe enviar al menos un lugar' })
  @ArrayMaxSize(100, { message: 'No se pueden crear más de 100 lugares por petición' })
  places: CreatePlaceDto[];
}