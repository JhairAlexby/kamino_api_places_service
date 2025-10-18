import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({
    summary: 'Verificar estado de la aplicación',
    description: 'Endpoint para verificar que la aplicación esté funcionando correctamente',
  })
  @ApiResponse({
    status: 200,
    description: 'Aplicación funcionando correctamente',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2024-01-15T10:30:00Z' },
        service: { type: 'string', example: 'kamino-places-api' },
      },
    },
  })
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'kamino-places-api',
    };
  }
}