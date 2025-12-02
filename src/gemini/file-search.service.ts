import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';

@Injectable()
export class FileSearchService {
  private readonly logger = new Logger(FileSearchService.name);
  private readonly apiKey: string;

  constructor(private configService: ConfigService) {
    const key = this.configService.get<string>('GEMINI_API_KEY');
    
    if (!key) {
      this.logger.error('GEMINI_API_KEY no está configurada');
      throw new Error('GEMINI_API_KEY no está configurada en las variables de entorno');
    }
    
    this.apiKey = key; // ← Ahora TypeScript sabe que no es undefined
  }

  // Sube un documento PDF a Gemini Files
  async uploadNarrative(filePath: string, fileName: string): Promise<string> {
    try {
      this.logger.log(`Subiendo archivo ${fileName}`);

      // Leer el archivo
      const fileBuffer = fs.readFileSync(filePath);
      const fileSize = fileBuffer.length;
      this.logger.log(`Tamaño: ${fileSize} bytes`);

      // Subir archivo a Gemini Files
      const uploadUrl = `https://generativelanguage.googleapis.com/upload/v1beta/files?key=${this.apiKey}`;
      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/pdf',
          'X-Goog-Upload-Protocol': 'raw',
          'X-Goog-Upload-Command': 'upload, finalize',
          'X-Goog-Upload-Header-Content-Length': fileSize.toString(),
          'X-Goog-Upload-Header-Content-Type': 'application/pdf',
        },
        body: fileBuffer,
      });

      const responseText = await response.text();
      this.logger.log(`Respuesta: status=${response.status}, ${responseText}`);

      if (!response.ok) {
        throw new Error(`Error subiendo archivo: ${response.status} ${responseText}`);
      }

      const data = JSON.parse(responseText);
      const fileId = data.file.name; // Formato: files/xxxxx
      this.logger.log(`Archivo subido: ${fileId}`);
      this.logger.log(`URI: ${data.file.uri}`);

      return fileId;
    } catch (error) {
      this.logger.error('Error subiendo narrativa', error);
      throw error;
    }
  }

  // Busca información en un archivo usando Gemini
  async searchInDocument(fileId: string, query: string): Promise<string> {
    try {
      this.logger.log(`Buscando en archivo: ${fileId}`);
      this.logger.log(`Query: ${query}`);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    fileData: {
                      mimeType: 'application/pdf',
                      fileUri: `https://generativelanguage.googleapis.com/v1beta/${fileId}`,
                    },
                  },
                  {
                    text: query,
                  },
                ],
              },
            ],
          }),
        },
      );

      if (!response.ok) {
        const error = await response.text();
        this.logger.error('Error en búsqueda', error);
        throw new Error(`Error en búsqueda: ${error}`);
      }

      const data = await response.json();
      const text = data.candidates[0]?.content?.parts[0]?.text || 'Sin respuesta';
      this.logger.log('Respuesta obtenida');
      return text;
    } catch (error) {
      this.logger.error('Error buscando en documento', error);
      throw error;
    }
  }

  // Elimina un archivo de Gemini Files
  async deleteDocument(fileId: string): Promise<void> {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/${fileId}?key=${this.apiKey}`,
        {
          method: 'DELETE',
        },
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Error eliminando archivo: ${error}`);
      }

      this.logger.log(`Archivo eliminado: ${fileId}`);
    } catch (error) {
      this.logger.error('Error eliminando archivo', error);
      throw error;
    }
  }
}
