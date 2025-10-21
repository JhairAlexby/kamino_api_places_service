import { ApiProperty } from '@nestjs/swagger';

export class DeleteResponseDto {
  @ApiProperty({ description: 'ID del recurso eliminado', example: '0f01ea32-5acd-4f27-9c33-c9e81c3b2db9' })
  id: string;

  @ApiProperty({ description: 'Indicador de eliminación', example: true })
  deleted: boolean;
}