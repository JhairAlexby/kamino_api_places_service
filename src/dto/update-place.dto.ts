import { PartialType } from '@nestjs/swagger';
import { CreatePlaceDto } from './create-place.dto';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePlaceDto extends PartialType(CreatePlaceDto) {
  @ApiProperty({
    description: 'ID del File Search Store',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  narrativeStoreId?: string | null; 

  @ApiProperty({
    description: 'ID del documento de narrativa',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  narrativeDocumentId?: string | null; 
}
