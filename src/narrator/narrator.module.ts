import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Place } from '../entities/place.entity';
import { PlacesService } from '../services/places.service';
import { FileSearchService } from '../gemini/file-search.service';
import { NarratorController } from '../controllers/narrator.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Place]),
  ],
  controllers: [NarratorController],
  providers: [PlacesService, FileSearchService],
  exports: []
})
export class NarratorModule {}
