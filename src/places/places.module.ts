import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlacesController } from '../controllers/places.controller';
import { NarrativesController } from './narratives.controller'; 
import { PlacesService } from '../services/places.service';
import { Place } from '../entities/place.entity';
import { GeminiModule } from '../gemini/gemini.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Place]),
    forwardRef(() => GeminiModule),
  ],
  controllers: [
    PlacesController,
    NarrativesController,
  ],
  providers: [PlacesService],
  exports: [PlacesService],
})
export class PlacesModule {}
