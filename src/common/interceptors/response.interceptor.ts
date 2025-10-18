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
        message: this.getSuccessMessage(request.method, request.route?.path),
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }

  private getSuccessMessage(method: string, path: string): string {
    const messages = {
      GET: 'Datos obtenidos exitosamente',
      POST: 'Recurso creado exitosamente',
      PATCH: 'Recurso actualizado exitosamente',
      PUT: 'Recurso actualizado exitosamente',
      DELETE: 'Recurso eliminado exitosamente',
    };

    return messages[method] || 'Operación completada exitosamente';
  }
}