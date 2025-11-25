import { Body, Controller, Post } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { FileSearchService } from './file-search.service';
import { PlacesService } from '../services/places.service';

@Controller('gemini')
export class GeminiController {
  constructor(
    private readonly geminiService: GeminiService,
    private readonly fileSearchService: FileSearchService,
    private readonly placesService: PlacesService,
  ) {}

  @Post('ask')
  async askGemini(@Body() body: { prompt: string }) {
    const respuesta = await this.geminiService.testPrompt(body.prompt);
    return {
      respuesta,
    };
  }

  // NUEVO ENDPOINT
  @Post('ask-with-narrative')
  async askWithNarrative(
    @Body() body: { placeId: string; question: string },
  ) {
    // Obtener el lugar
    const place = await this.placesService.findOne(body.placeId);
    
    if (!place) {
      return {
        success: false,
        message: 'Lugar no encontrado',
      };
    }

    if (!place.narrativeDocumentId) {
      return {
        success: false,
        message: 'Este lugar no tiene narrativa asociada',
      };
    }

    // Buscar en la narrativa
    const respuesta = await this.fileSearchService.searchInDocument(
      place.narrativeDocumentId,
      body.question,
    );

    return {
      success: true,
      place: {
        id: place.id,
        name: place.name,
      },
      question: body.question,
      answer: respuesta,
    };
  }
}
