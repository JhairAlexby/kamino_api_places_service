import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm'; // ← Agregar Not e IsNull aquí
import { Place } from '../entities/place.entity';
import { FileSearchService } from '../gemini/file-search.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PdfMaintenanceService {
  private readonly logger = new Logger(PdfMaintenanceService.name);
  private readonly apiKey: string;

  constructor(
    @InjectRepository(Place)
    private readonly placeRepository: Repository<Place>,
    private readonly fileSearchService: FileSearchService,
  ) {
    this.apiKey = process.env.GEMINI_API_KEY || '';
  }

  // Ejecutar cada 24 horas a las 3:00 AM
  @Cron('0 3 * * *')
  async refreshExpiredPdfs() {
    this.logger.log('🔄 Iniciando mantenimiento de PDFs...');

    try {
      // 1. Obtener todos los lugares que tienen narrativa
      const placesWithNarrative = await this.placeRepository.find({
        where: { 
          narrativeDocumentId: Not(IsNull()) 
        },
      });

      this.logger.log(`📄 Encontrados ${placesWithNarrative.length} lugares con narrativa`);

      let refreshed = 0;
      let failed = 0;

      // 2. Para cada lugar, verificar si el archivo existe en Gemini
      for (const place of placesWithNarrative) {
        try {
          // Verificar si el archivo existe
          const fileExists = await this.checkFileExists(place.narrativeDocumentId!);
          
          if (!fileExists) {
            this.logger.warn(`⚠️ Archivo expirado para ${place.name}, intentando re-subir...`);
            
            // Intentar re-subir desde el archivo local guardado
            const pdfPath = path.join('./narratives', `${place.id}.pdf`);
            
            if (fs.existsSync(pdfPath)) {
              const newFileId = await this.fileSearchService.uploadNarrative(
                pdfPath,
                `${place.name}.pdf`
              );
              
              // Actualizar el narrativeDocumentId en la BD
              await this.placeRepository.update(place.id, {
                narrativeDocumentId: newFileId,
              });
              
              this.logger.log(`✅ PDF re-subido para: ${place.name}`);
              refreshed++;
            } else {
              this.logger.error(`❌ No se encontró el PDF local para: ${place.name}`);
              failed++;
            }
          } else {
            this.logger.log(`✓ Archivo válido para: ${place.name}`);
          }
        } catch (error) {
          this.logger.error(`❌ Error procesando ${place.name}:`, error.message);
          failed++;
        }
      }

      this.logger.log(`✅ Mantenimiento completado: ${refreshed} actualizados, ${failed} fallidos`);
    } catch (error) {
      this.logger.error('❌ Error en mantenimiento de PDFs:', error);
    }
  }

  // Método auxiliar para verificar si un archivo existe en Gemini
  private async checkFileExists(fileId: string): Promise<boolean> {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/${fileId}?key=${this.apiKey}`,
        { method: 'GET' }
      );
      return response.ok;
    } catch {
      return false;
    }
  }

  // Método manual para forzar actualización (útil para testing)
  async forceRefresh() {
    this.logger.log('🔄 Forzando actualización manual de PDFs...');
    await this.refreshExpiredPdfs();
  }
}
