import { Module, forwardRef } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { GeminiController } from './gemini.controller';
import { FileSearchService } from './file-search.service';
import { PlacesModule } from '../places/places.module';

@Module({
  imports: [
    forwardRef(() => PlacesModule), // <-- Usa forwardRef
  ],
  controllers: [GeminiController],
  providers: [
    GeminiService,
    FileSearchService,
  ],
  exports: [
    GeminiService,
    FileSearchService,
  ],
})
export class GeminiModule {}
