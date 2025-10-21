import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    return next.handle().pipe(
      map((data) => ({
        success: true,
        statusCode: response.statusCode,
        message: this.getSuccessMessage(response.statusCode, request.method, request.route?.path),
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }

  private getSuccessMessage(statusCode: number, method: string, path?: string): string {
    const messagesByStatus: Record<number, string> = {
      200: 'Datos obtenidos exitosamente',
      201: 'Recurso creado exitosamente',
      202: 'Solicitud aceptada',
      204: 'Operación completada exitosamente',
    };

    // Excepciones conocidas: endpoints de búsqueda que usan POST
    if (method === 'POST' && path && (path.includes('nearby') || path.includes('search'))) {
      return 'Datos obtenidos exitosamente';
    }

    return messagesByStatus[statusCode] || 'Operación completada exitosamente';
  }
}