import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GeminiService } from './gemini.service';
import { GeminiController } from './gemini.controller';
import { FileSearchService } from './file-search.service';
import { PlacesModule } from '../places/places.module';

@Module({
  imports: [
    ConfigModule, 
    forwardRef(() => PlacesModule),
  ],
  controllers: [GeminiController],
  providers: [GeminiService, FileSearchService],
  exports: [GeminiService, FileSearchService],
})
export class GeminiModule {}
