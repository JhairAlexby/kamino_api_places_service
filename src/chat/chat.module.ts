import { Module } from '@nestjs/common';
import { ChatController } from '../controllers/chat.controller';
import { ChatService } from '../services/chat.service';
import { PlacesModule } from '../places/places.module';
import { GeminiModule } from '../gemini/gemini.module';

@Module({
  imports: [PlacesModule, GeminiModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
