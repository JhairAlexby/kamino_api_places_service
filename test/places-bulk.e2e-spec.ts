import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppModule } from '../src/app.module';
import { Place } from '../src/entities/place.entity';

describe('Places Bulk Create (e2e)', () => {
  let app: INestApplication;
  let placeRepository: Repository<Place>;

  const mockPlaceRepository = {
    create: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(),
    findOne: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getRepositoryToken(Place))
      .useValue(mockPlaceRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    placeRepository = moduleFixture.get<Repository<Place>>(getRepositoryToken(Place));
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /api/v1/places/bulk', () => {
    it('debe crear múltiples lugares exitosamente', async () => {
      const mockPlaces = [
        { id: '1', name: 'Café Central', latitude: -12.046374, longitude: -77.042793 },
        { id: '2', name: 'Museo de Historia', latitude: -12.045374, longitude: -77.043793 }
      ];

      mockPlaceRepository.create.mockImplementation((dto) => ({ ...dto, id: '1' }));
      mockPlaceRepository.save.mockResolvedValueOnce(mockPlaces[0]).mockResolvedValueOnce(mockPlaces[1]);

      const response = await request(app.getHttpServer())
        .post('/api/v1/places/bulk')
        .send({
          places: [
            {
              name: 'Café Central',
              description: 'Un acogedor café en el centro de la ciudad',
              category: 'cafetería',
              tags: ['vintage', 'tranquilo'],
              latitude: -12.046374,
              longitude: -77.042793,
              address: 'Av. Larco 123, Miraflores, Lima',
              imageUrl: 'https://example.com/images/cafe.jpg',
              isHiddenGem: false
            },
            {
              name: 'Museo de Historia',
              description: 'Exhibiciones de historia local',
              category: 'museo',
              tags: ['educativo', 'familiar'],
              latitude: -12.045374,
              longitude: -77.043793,
              address: 'Av. Principal 456',
              imageUrl: 'https://example.com/museo.jpg',
              isHiddenGem: false,
              openingTime: '09:00',
              closingTime: '18:00',
              tourDuration: 90
            }
          ]
        })
        .expect(201);

      expect(response.body).toMatchObject({
        success: true,
        statusCode: 201,
        data: {
          created: 2,
          failed: 0,
          results: expect.arrayContaining([
            expect.objectContaining({ status: 'created', name: 'Café Central' }),
            expect.objectContaining({ status: 'created', name: 'Museo de Historia' })
          ])
        }
      });
    });

    it('debe manejar errores individuales sin afectar otros lugares', async () => {
      mockPlaceRepository.create.mockImplementation((dto) => ({ ...dto, id: '1' }));
      mockPlaceRepository.save.mockRejectedValueOnce(new Error('Error de base de datos')).mockResolvedValueOnce({ id: '2', name: 'Museo OK' });

      const response = await request(app.getHttpServer())
        .post('/api/v1/places/bulk')
        .send({
          places: [
            {
              name: 'Lugar Fallido',
              description: 'Este lugar fallará',
              category: 'test',
              latitude: -12.046374,
              longitude: -77.042793,
              address: 'Dirección test'
            },
            {
              name: 'Museo OK',
              description: 'Este lugar se creará bien',
              category: 'museo',
              latitude: -12.045374,
              longitude: -77.043793,
              address: 'Dirección OK'
            }
          ]
        })
        .expect(201);

      expect(response.body.data).toMatchObject({
        created: 1,
        failed: 1
      });
      expect(response.body.data.results).toHaveLength(2);
    });

    it('debe validar el límite máximo de 100 lugares', async () => {
      const manyPlaces = Array.from({ length: 101 }, (_, i) => ({
        name: `Lugar ${i + 1}`,
        description: `Descripción ${i + 1}`,
        category: 'test',
        latitude: -12.046374 + i * 0.001,
        longitude: -77.042793 + i * 0.001,
        address: `Dirección ${i + 1}`
      }));

      await request(app.getHttpServer())
        .post('/api/v1/places/bulk')
        .send({ places: manyPlaces })
        .expect(400);
    });
  });
});