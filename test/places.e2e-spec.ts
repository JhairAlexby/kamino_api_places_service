import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PlacesController } from '../src/controllers/places.controller';
import { PlacesService } from '../src/services/places.service';
import { Place } from '../src/entities/place.entity';


describe('Places Endpoints (e2e)', () => {
  let app: INestApplication;

  const repoMock = {
    create: jest.fn((dto) => ({ ...dto, id: 'uuid-1' })),
    save: jest.fn(async (place) => ({ ...place })),
    findOne: jest.fn(async ({ where: { id } }: any) => ({ id })),
    createQueryBuilder: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [PlacesController],
      providers: [
        PlacesService,
        { provide: getRepositoryToken(Place), useValue: repoMock },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/places (POST) retrocompat sin nuevos campos', async () => {
    const payload = {
      name: 'Café Central',
      description: 'Desc',
      category: 'cafeteria',
      latitude: 0,
      longitude: 0,
      address: 'Av. Principal 123',
    };
    const res = await request(app.getHttpServer()).post('/places').send(payload);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).not.toHaveProperty('openingTime');
  });

  it('/places (POST) debe validar closingTime > openingTime', async () => {
    const payload = {
      name: 'Café Central',
      description: 'Desc',
      category: 'cafeteria',
      latitude: 0,
      longitude: 0,
      address: 'Av. Principal 123',
      openingTime: '10:00',
      closingTime: '09:00',
    };
    const res = await request(app.getHttpServer()).post('/places').send(payload);
    expect(res.status).toBe(400);
  });
});