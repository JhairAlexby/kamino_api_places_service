import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  NotFoundException,
  BadRequestException,
  ForbiddenException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PlacesService } from '../services/places.service';
import { FileSearchService } from '../gemini/file-search.service';
import * as fs from 'fs';

@Controller('places')
export class NarrativesController {
  constructor(
    private readonly placesService: PlacesService,
    private readonly fileSearchService: FileSearchService,
  ) {}

  @Post(':id/narrative')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          // Guardar en carpeta narratives (para mantenimiento automático)
          const uploadPath = './narratives';
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          // Nombrar archivo con el ID del lugar para fácil identificación
          const placeId = req.params.id;
          const ext = extname(file.originalname);
          cb(null, `${placeId}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf') {
          return cb(
            new BadRequestException('Solo se permiten archivos PDF'),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB máximo
      },
    }),
  )
  async uploadNarrative(
    @Param('id') placeId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    // Verificar que el lugar existe
    const place = await this.placesService.findOne(placeId);
    if (!place) {
      // Eliminar archivo si el lugar no existe
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      throw new NotFoundException(`Lugar con ID ${placeId} no encontrado`);
    }

    try {
      // Subir a Gemini File Search Store
      const documentId = await this.fileSearchService.uploadNarrative(
        file.path,
        `${place.name}-narrative.pdf`,
      );

      // Actualizar el lugar con el documentId
      await this.placesService.update(placeId, {
        narrativeStoreId: process.env.FILE_SEARCH_STORE_ID || null,
        narrativeDocumentId: documentId,
      });

      // NO eliminar el archivo local - lo necesitamos para el cron job
      // Queda guardado como: ./narratives/{placeId}.pdf

      return {
        success: true,
        message: 'Narrativa subida exitosamente',
        data: {
          placeId,
          placeName: place.name,
          documentId,
          localBackup: `narratives/${placeId}.pdf`,
        },
      };
    } catch (error) {
      // Solo eliminar archivo en caso de error de subida
      if (file?.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      throw error;
    }
  }

  @Get(':id/narrative')
  async getNarrative(@Param('id') placeId: string) {
    const place = await this.placesService.findOne(placeId);

    if (!place) {
      throw new NotFoundException(`Lugar con ID ${placeId} no encontrado`);
    }

    if (!place.narrativeDocumentId) {
      throw new NotFoundException(`Este lugar no tiene narrativa asociada`);
    }

    // Verificar si existe copia local
    const localPath = `./narratives/${placeId}.pdf`;
    const hasLocalBackup = fs.existsSync(localPath);

    return {
      success: true,
      data: {
        placeId: place.id,
        placeName: place.name,
        hasNarrative: true,
        narrativeStoreId: place.narrativeStoreId,
        narrativeDocumentId: place.narrativeDocumentId,
        hasLocalBackup,
      },
    };
  }

  @Delete(':id/narrative')
  async deleteNarrative(@Param('id') placeId: string) {
    const place = await this.placesService.findOne(placeId);

    if (!place) {
      throw new NotFoundException(`Lugar con ID ${placeId} no encontrado`);
    }

    if (!place.narrativeDocumentId) {
      throw new NotFoundException(`Este lugar no tiene narrativa asociada`);
    }

    try {
      // Eliminar de Gemini
      await this.fileSearchService.deleteDocument(place.narrativeDocumentId);
    } catch (error) {
      // Continuar aunque falle (el archivo ya podría estar expirado)
      console.warn('No se pudo eliminar de Gemini (posiblemente ya expirado):', error.message);
    }

    // Eliminar archivo local también
    const localPath = `./narratives/${placeId}.pdf`;
    if (fs.existsSync(localPath)) {
      fs.unlinkSync(localPath);
    }

    // Limpiar campos en la base de datos
    await this.placesService.update(placeId, {
      narrativeStoreId: null,
      narrativeDocumentId: null,
    });

    return {
      success: true,
      message: 'Narrativa eliminada exitosamente',
    };
  }
  @Post('refresh-all-pdfs')
async refreshAllPdfs() {
  // Solo permitir en desarrollo
  if (process.env.NODE_ENV === 'production') {
    throw new ForbiddenException('Operación no permitida en producción');
  }
  
  const { PdfMaintenanceService } = await import('../services/pdf-maintenance.service.js');
  const maintenanceService = new PdfMaintenanceService(
    this.placesService['placeRepository'],
    this.fileSearchService
  );
  
  await maintenanceService.refreshExpiredPdfs();
  
  return {
    success: true,
    message: 'PDFs actualizados'
  };
}

}
