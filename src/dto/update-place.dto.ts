import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePlaceDto } from './create-place.dto';

export class UpdatePlaceDto extends PartialType(CreatePlaceDto) {
  @ApiProperty({
    description: 'Todos los campos son opcionales para actualización',
    example: {
      name: 'Café Central Renovado',
      description: 'Un acogedor café renovado en el centro de la ciudad',
      isHiddenGem: true,
    },
  })
  example?: any;
}