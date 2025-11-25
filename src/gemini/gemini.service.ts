import { Injectable, Logger } from '@nestjs/common';
import { geminiAi } from '../config/gemini.config';

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);

  /**
   * Prueba simple para comprobar conectividad con Gemini
   */
  async testPrompt(prompt: string): Promise<string> {
    try {
        const model = geminiAi.getGenerativeModel({ model: 'gemini-2.5-pro' });


      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      this.logger.error('Error al consultar Gemini:', error);
      throw error;
    }
  }
}
