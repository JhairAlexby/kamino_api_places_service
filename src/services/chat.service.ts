import { Injectable } from '@nestjs/common';
import { PlacesService } from '../services/places.service';
import { FileSearchService } from '../gemini/file-search.service';
import { PlaceResponseDto } from '../dto/place-response.dto';

@Injectable()
export class ChatService {
  private lastPlace: PlaceResponseDto | null = null;

  constructor(
    private readonly placesService: PlacesService,
    private readonly fileSearchService: FileSearchService,
  ) {}

  async handleUserMessage(message: string) {
    const saludos = ['hola', 'buenas', 'qué tal', 'hey', 'saludos', 'hello'];
    const despedidas = ['adiós', 'gracias', 'nos vemos', 'hasta luego', 'bye'];
    const msgLimpio = this.limpiarTexto(message);

    // DESPEDIDAS
    if (despedidas.some(s => msgLimpio.includes(s))) {
      this.lastPlace = null;
      return { type: 'farewell', answer: '¡Hasta pronto! Gracias por explorar Kamino.' };
    }

    // SALUDOS
    if (saludos.some(s => msgLimpio.includes(s))) {
      return { type: 'greeting', answer: '¡Hola! ¿Sobre qué lugar quieres saber más?' };
    }

    // INTENT DE SUGERENCIAS Y RECOMENDACIONES ("¿qué otros lugares puedo visitar?")
    const RECOMMEND_WORDS = [
      'otros lugares', 'recomendación', 'recomiéndame', 'más lugares',
      'que más visitar', 'lugares cercanos', 'lugares turísticos',
      'sugerencia', 'qué visitar', 'lugares para conocer'
    ];
    if (RECOMMEND_WORDS.some(w => msgLimpio.includes(w))) {
      const allPlacesPaginated = await this.placesService.findAll({});
      const allPlaces: PlaceResponseDto[] = allPlacesPaginated.data;
      // Filtra que no sea el lugar en contexto
      const suggestions = allPlaces
        .filter(p => !this.lastPlace || p.id !== this.lastPlace.id)
        .slice(0, 3)
        .map(place => `• ${place.name} (${place.category})`);
      const respuesta = `Aquí tienes otros lugares que puedes visitar:\n${suggestions.join('\n')}\n¿Te gustaría saber más sobre alguno de ellos?`;
      return { type: 'recommendation', answer: respuesta };
    }

    // Buscar lugar en la pregunta; si hay, actualiza contexto
    const foundPlace = await this.findPlaceInMessage(message);
    if (foundPlace) this.lastPlace = foundPlace;

    const isGeneralPlaceQuestion =
      /(cuéntame|dime|qué sabes|háblame|algo interesante|dato curioso|historia).*?(museo|parque|café|lugar|sitio|monumento)/i.test(message);

    // Responde dato curioso breve SI hay lugar
    if ((isGeneralPlaceQuestion && this.lastPlace) || (foundPlace && isGeneralPlaceQuestion)) {
      const placeObj = foundPlace || this.lastPlace!;
      if (typeof placeObj.narrativeDocumentId === 'string') {
        let datoCorto = await this.fileSearchService.searchInDocument(
          placeObj.narrativeDocumentId,
          `Responde con SOLO un dato curioso o interesante sobre este lugar, máximo tres oraciones.`
        );
        datoCorto = this.limpiarNarrativaRespuesta(datoCorto);
        return {
          type: 'curiosity',
          answer: datoCorto + '\n¿Quieres saber algo más de este lugar?',
        };
      }
      return {
        type: 'curiosity',
        answer: 'Este lugar tiene varias cosas interesantes. ¿Te gustaría saber horarios, actividades o historia?',
      };
    }

    // Chequeo de contexto para últimas preguntas
    if (this.lastPlace) {
      const SCHEDULE_WORDS = [
        'horario', 'abre', 'cierran', 'cierra', 'abierto', 'cerrado', 'día', 'días', 'horarios'
      ];
      const INFO_WORDS = [
        'dirección', 'ubicación', 'categoría', 'tags', 'etiqueta', 'ubicacion'
      ];
      const PRICE_WORDS = [
        'costo', 'precio', 'entrada', 'tarifa', 'boletos', 'admisión', 'cuánto cuesta', 'valor'
      ];
      const ACTIVITY_WORDS = [
        'actividades', 'evento', 'taller', 'charla', 'recomendación', 'programa'
      ];
      // HORARIO
      if (SCHEDULE_WORDS.some(w => msgLimpio.includes(w))) {
        return {
          type: 'schedule',
          answer: this.envuelveRespuesta(this.formatSchedule(this.lastPlace), 'schedule')
        };
      }
      // PRECIO
      if (PRICE_WORDS.some(w => msgLimpio.includes(w))) {
        if (typeof this.lastPlace.narrativeDocumentId === 'string') {
          let priceAnswer = await this.fileSearchService.searchInDocument(
            this.lastPlace.narrativeDocumentId,
            `¿Cuál es el precio o tarifa de entrada de este lugar? Responde brevemente.`
          );
          priceAnswer = this.limpiarNarrativaRespuesta(priceAnswer);
          return { type: 'price', answer: priceAnswer };
        }
        return { type: 'price', answer: 'No tengo información de precios para este lugar.' };
      }
      // ACTIVIDADES
      if (ACTIVITY_WORDS.some(w => msgLimpio.includes(w))) {
        if (typeof this.lastPlace.narrativeDocumentId === 'string') {
          let actAnswer = await this.fileSearchService.searchInDocument(
            this.lastPlace.narrativeDocumentId,
            `¿Qué actividades, talleres o eventos ofrece este lugar? Responde solo con lo más destacado, en cinco oraciones.`
          );
          actAnswer = this.limpiarNarrativaRespuesta(actAnswer);
          return { type: 'activity', answer: actAnswer };
        }
        return { type: 'activity', answer: 'No tengo actividades registradas para este lugar.' };
      }
      // INFO GENERAL
      if (INFO_WORDS.some(w => msgLimpio.includes(w))) {
        return {
          type: 'info',
          answer: this.envuelveRespuesta(this.formatInfo(this.lastPlace), 'info')
        };
      }
    }

    // Consulta narrativa solo si existe (y es tipo string)
    if (this.lastPlace && typeof this.lastPlace.narrativeDocumentId === 'string') {
      let geminiAnswer = await this.fileSearchService.searchInDocument(
        this.lastPlace.narrativeDocumentId,
        `Responde de forma muy breve y coherente: ${message} Maximo tres oraciones.`
      );
      geminiAnswer = this.limpiarNarrativaRespuesta(geminiAnswer);
      return { type: 'narrative', answer: geminiAnswer };
    }

    // Sin contexto: invita a preguntar sobre un lugar
    return {
      type: 'other',
      answer: 'Intenta preguntar sobre algún lugar, actividad o recomendación en Kamino. ¡Te ayudo con gusto!'
    };
  }

  limpiarTexto(text: string) {
    return text
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  async findPlaceInMessage(message: string): Promise<PlaceResponseDto | null> {
    const allPlacesPaginated = await this.placesService.findAll({});
    const allPlaces: PlaceResponseDto[] = allPlacesPaginated.data;
    const msgLimpio = this.limpiarTexto(message);

    let mejorPlace: PlaceResponseDto | null = null;
    let maxScore = 0;

    for (const place of allPlaces) {
      const nameLimpio = this.limpiarTexto(place.name);
      if (msgLimpio === nameLimpio) return place;
      const palabrasMsg = new Set(msgLimpio.split(' '));
      const palabrasNombre = nameLimpio.split(' ');
      let score = 0;
      palabrasNombre.forEach(palabra => {
        if (palabra.length > 3 && palabrasMsg.has(palabra)) score++;
      });
      if (place.tags) {
        place.tags.forEach(tag => {
          if (msgLimpio.includes(this.limpiarTexto(tag))) score += 2;
        });
      }
      if (score > maxScore) {
        maxScore = score;
        mejorPlace = place;
      }
    }
    return maxScore > 0 ? mejorPlace : null;
  }

  limpiarNarrativaRespuesta(text: string): string {
    return text
      .replace(/(seg[uú]n el texto.*?[:\-]\s*)/gi, '')
      .replace(/(el texto proporciona.*?[:\-]\s*)/gi, '')
      .replace(/(en este documento.*?[:\-]\s*)/gi, '')
      .replace(/(el texto.*?no menciona.*?\. ?)/gi, '')
      .replace(/(de acuerdo al documento.*?[:\-]\s*)/gi, '')
      .replace(/(la información proporcionada.*?[:\-]\s*)/gi, '')
      .replace(/(el texto describe.*?[:\-]\s*)/gi, '')
      .replace(/(documento aportado.*?[:\-]\s*)/gi, '')
      .replace(/(de acuerdo al texto.*?[:\-]\s*)/gi, '')
      .replace(/(de acuerdo a la sección.*?[:\-]\s*)/gi, '')
      .replace(/(el archivo.*?[:\-]\s*)/gi, '')
      .replace(/\n{2,}/g, '\n')
      .trim();
  }

  envuelveRespuesta(texto: string, tipo: string = ''): string {
    const firmasPorTipo: Record<string, string[]> = {
      greeting: [
        '¡Hola! ¿En qué lugar te gustaría saber más?',
        '¿En qué puedo ayudarte? Pregunta por horarios, historia o actividades.',
        'Bienvenido a Kamino. ¿Sobre qué lugar tienes interés?'
      ],
      schedule: [
        '¡Disfruta tu recorrido y recuerda explorar cada rincón!',
        'Que tengas excelente visita, te esperamos.'
      ],
      info: [
        '¿Te gustaría saber sobre actividades, precio, historia o recomendaciones?',
        '¡Gracias por consultar! ¿Quieres saber más sobre este lugar?'
      ],
      price: [
        '¿Te gustaría más detalles sobre actividades, horarios o descuentos?',
        '¡Listo! Si quieres saber horarios o actividades, dime.'
      ],
      activity: [
        'Las actividades pueden cambiar, ¡pregunta por eventos actuales!',
        '¿Quieres saber talleres, horarios o precios?'
      ],
      curiosity: [
        '¿Te interesa saber más sobre este lugar?',
        '¿Te gustaría saber horarios, precios o actividades?'
      ],
      recommendation: [
        '¡Aventúrate a descubrir nuevos lugares!',
        '¿Te gustaría saber horarios, actividades o historia sobre algún lugar sugerido?'
      ],
      narrative: [
        '¿Te gustaría saber más sobre actividades, horarios o recomendaciones? Pregunta lo que quieras.',
        'La curiosidad te lleva lejos. ¡Sigue explorando!'
      ],
      not_found_place: [
        'Parece que aún no tenemos ese lugar, viajero. ¡Esperamos poder ayudarte con otro!',
        'Nuestro mapa sigue creciendo. Gracias por consultar.'
      ],
      not_found: [
        'No entendí tu consulta, pero gracias por interactuar.',
        'Estoy aquí para ayudarte con lugares. Intenta una pregunta diferente.'
      ],
      other: [
        'No pude responder, pero tu curiosidad nos ayuda a mejorar.',
        'Si tienes otra duda sobre algún lugar, ¡inténtalo de nuevo!',
        '¡Gracias por explorar Kamino!'
      ],
      farewell: [
        '¡Hasta pronto! Gracias por explorar Kamino.',
        '¡Nos vemos! Vuelve cuando quieras.'
      ],
    };

    const firmas = firmasPorTipo[tipo] || [
      '¡Disfruta tu experiencia, explorador!',
      'Bienvenido a Kamino, donde cada lugar cuenta una historia.'
    ];
    const firma = firmas[Math.floor(Math.random() * firmas.length)];
    return `${texto}\n\n${firma}`;
  }

  formatSchedule(place: PlaceResponseDto): string {
    const lines: string[] = [];
    if (place.scheduleByDay) {
      Object.entries(place.scheduleByDay).forEach(([day, { open, close }]) => {
        lines.push(`${this.formatDay(day)}: ${open}–${close}`);
      });
    }
    if (place.closedDays?.length) {
      lines.push(`Cerrado: ${place.closedDays.map(d => this.formatDay(d)).join(', ')}`);
    }
    return `Horarios de ${place.name}:\n${lines.join('\n')}`;
  }

  formatInfo(place: PlaceResponseDto): string {
    return `Información sobre ${place.name}:\nDirección: ${place.address}\nCategoría: ${place.category}\nTags: ${place.tags?.join(', ') || 'N/A'}`;
  }

  formatDay(day: string): string {
    const dict: Record<string, string> = {
      monday: 'Lunes', tuesday: 'Martes', wednesday: 'Miércoles', thursday: 'Jueves',
      friday: 'Viernes', saturday: 'Sábado', sunday: 'Domingo'
    };
    return dict[day] || day;
  }
}
