import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlacesModule } from './places/places.module';
import { HealthController } from './health/health.controller';
import databaseConfig from './config/database.config';
import { ChatModule } from './chat/chat.module';
import { NarratorModule } from './narrator/narrator.module';
import { GeminiModule } from './gemini/gemini.module'; 
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        configService.get('database')!,
      inject: [ConfigService],
    }),
    PlacesModule,
    GeminiModule, 
    ChatModule,
    NarratorModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}

