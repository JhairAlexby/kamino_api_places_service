import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private geminiAi: GoogleGenerativeAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    
    if (!apiKey) {
      this.logger.error('GEMINI_API_KEY no está configurada');
      throw new Error('GEMINI_API_KEY no está configurada en las variables de entorno');
    }
    
    this.geminiAi = new GoogleGenerativeAI(apiKey);
    this.logger.log('Gemini AI inicializado correctamente');
  }

  // Prueba simple para comprobar conectividad con Gemini
  async testPrompt(prompt: string): Promise<string> {
    try {
      const model = this.geminiAi.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      this.logger.error('Error al consultar Gemini', error);
      throw error;
    }
  }
}
