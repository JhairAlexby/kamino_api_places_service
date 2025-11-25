import { Controller, Post, Body } from '@nestjs/common';
import { ChatService } from '../services/chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async chat(@Body() body: { message: string }) {
    return this.chatService.handleUserMessage(body.message);
  }
}
