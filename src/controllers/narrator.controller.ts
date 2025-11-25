import { Controller, Get, Param } from '@nestjs/common';
import { PlacesService } from '../services/places.service';
import { FileSearchService } from '../gemini/file-search.service';

@Controller('narrator')
export class NarratorController {
  constructor(
    private readonly placesService: PlacesService,
    private readonly fileSearchService: FileSearchService,
  ) {}

  @Get(':placeId')
  async narrate(@Param('placeId') placeId: string) {
    // 1. Busca el lugar por id
    const place = await this.placesService.findOne(placeId);
    if (!place || !place.narrativeDocumentId)
      return { error: "Lugar no encontrado o sin narrativa." };

    // 2. Elige prompt narrativo sin frases introductorias
    const prompts = [
      "Sin frases introductorias ni saludos, narra directamente una curiosidad, historia o anécdota sobre este lugar, en menos de cinco oraciones. Tono cálido y relajado.",
      "Narra directo un dato interesante o leyenda sobre el lugar, en tono amable y breve. No uses frases como 'claro que sí', 'aquí tienes' ni saludos.",
      "Como guía local, relata una historia sobre el lugar, iniciando por el dato, sin frases previas ni presentación ni saludos. Usa máximo ocho oraciones.",
      "Redacta una anécdota breve y diferente sobre este lugar SIN saludos ni frases como 'aquí tienes', 'por supuesto', etc."
    ];
    const prompt = prompts[Math.floor(Math.random() * prompts.length)];

    // 3. Solicitar narrativa
    let text = await this.fileSearchService.searchInDocument(
      place.narrativeDocumentId,
      prompt
    );

    // 4. Limpia frases introductorias/muletillas si aparecen
    text = this.limpiarFraseIntro(text);

    // 5. Mensaje/invitación dinámica al chatbot
    const invites = [
      "¿Quieres horarios, precios o más detalles? Pregunta en el chatbot de Kamino.",
      "Para información, actividades o consejos, sigue la conversación en nuestro chat.",
      "Descubre aún más usando el chat, puedes preguntar lo que quieras.",
      "¿Tienes dudas específicas? Nuestro chat está listo para ayudarte.",
      "¿Te interesa una recomendación o sabes lo que buscas? El asistente de Kamino te escucha."
    ];
    const invite = invites[Math.floor(Math.random() * invites.length)];

    return { text: `${text}\n\n${invite}` };
  }

  // Regex para limpiar introducciones y muletillas
  private limpiarFraseIntro(text: string): string {
    return text
      .replace(
        /^[¡!]*(claro que sí|por supuesto|con gusto|hola viajero|aquí tienes|te cuento|permíteme contarte|déjame decirte|con alegría|perfecto|hola|estimado viajero|seguro que sí)(.|[\n])+?[.!¿?\n]+/i,
        ''
      )
      .replace(/^(saludos|buenas.*|[¡!]?hola(\s|,).*)[\.!¿?\n]+/i, '')
      .replace(/^\s+/, '');
  }
}
