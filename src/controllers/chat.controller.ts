import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { ChatService } from '../services/chat.service';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @ApiOperation({
    summary: 'Conversar con el chatbot de lugares',
    description: 'Envía un mensaje y recibe una respuesta automatizada sobre rutas, lugares o curiosidades.'
  })
  @ApiBody({
    description: 'Mensaje enviado por el usuario',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: '¿Qué puedo hacer en el Museo de la Marimba?' }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Respuesta del chatbot.',
    schema: {
      type: 'object',
      properties: {
        type: { type: 'string', example: 'curiosity' },
        answer: { type: 'string', example: '¿Sabías que el Museo de la Marimba alberga el instrumento más antiguo de Chiapas?' }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Mensaje no válido.',
    schema: { example: { statusCode: 400, message: 'El mensaje es requerido', error: 'Bad Request' } }
  })
  async chat(@Body() body: { message: string }) {
    return this.chatService.handleUserMessage(body.message);
  }
}
