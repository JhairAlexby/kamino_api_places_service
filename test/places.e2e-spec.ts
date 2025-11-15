import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { PlacesController } from '../src/controllers/places.controller';
import { PlacesService } from '../src/services/places.service';
import { CreatePlaceDto } from '../src/dto/create-place.dto';
import { UpdatePlaceDto } from '../src/dto/update-place.dto';
import { FilterPlacesDto } from '../src/dto/filter-places.dto';
import { NearbySearchDto } from '../src/dto/nearby-search.dto';
import { PaginatedResponseDto } from '../src/dto/paginated-response.dto';
import { PlaceResponseDto } from '../src/dto/place-response.dto';
import { DeleteResponseDto } from '../src/dto/delete-response.dto';

describe('PlacesController (e2e with mocked service)', () => {
  let app: INestApplication;

  const now = new Date('2024-01-15T10:30:00Z');
  const basePlace: PlaceResponseDto = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Museo de Historia',
    description: 'Exhibiciones de historia local',
    category: 'museo',
    tags: ['educativo', 'familiar'],
    latitude: -12.046374,
    longitude: -77.042793,
    address: 'Av. Principal 123',
    imageUrl: 'https://example.com/museo.jpg',
    isHiddenGem: false,
    openingTime: '09:00',
    closingTime: '18:00',
    tourDuration: 90,
    createdAt: now,
    updatedAt: now,
  } as PlaceResponseDto;

  const categories = ['cafetería', 'museo', 'parque'];
  const tags = ['vintage', 'tranquilo', 'familiar', 'educativo'];

  const mockService: Partial<PlacesService> = {
    create: async (dto: CreatePlaceDto) => {
      let latitude = dto.latitude ?? basePlace.latitude;
      let longitude = dto.longitude ?? basePlace.longitude;
      const anyDto: any = dto as any;
      if (anyDto.coordinates) {
        const m = (anyDto.coordinates as string).match(/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/);
        if (m) {
          latitude = parseFloat(m[1]);
          longitude = parseFloat(m[2]);
        }
      }
      const { coordinates, ...rest } = anyDto;
      return { ...basePlace, ...rest, latitude, longitude };
    },
    findAll: async (filter: FilterPlacesDto) =>
      new PaginatedResponseDto<PlaceResponseDto>([basePlace], {
        page: filter.page ?? 1,
        limit: filter.limit ?? 10,
        total: 1,
        totalPages: 1,
        hasPrevious: false,
        hasNext: false,
      }),
    findOne: async (id: string) => ({ ...basePlace, id }),
    update: async (id: string, dto: UpdatePlaceDto) => ({ ...basePlace, id, ...dto }),
    toggleHiddenGem: async (id: string) => ({ ...basePlace, id, isHiddenGem: !basePlace.isHiddenGem }),
    remove: async (id: string) => ({ id, deleted: true } as DeleteResponseDto),
    findNearby: async (dto: NearbySearchDto) => [{ ...basePlace, distance: 2.5 }],
    getCategories: async () => categories,
    getTags: async () => tags,
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [PlacesController],
      providers: [
        { provide: PlacesService, useValue: mockService },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/v1/places crea un lugar con campos opcionales', async () => {
    const payload: CreatePlaceDto = {
      name: 'Museo de Historia',
      description: 'Exhibiciones de historia local',
      category: 'museo',
      tags: ['educativo', 'familiar'],
      latitude: -12.046374,
      longitude: -77.042793,
      address: 'Av. Principal 123',
      imageUrl: 'https://example.com/museo.jpg',
      isHiddenGem: false,
      openingTime: '09:00',
      closingTime: '18:00',
      tourDuration: 90,
    };

    const res = await request(app.getHttpServer())
      .post('/api/v1/places')
      .send(payload)
      .expect(201);

    expect(res.body.name).toBe(payload.name);
    expect(res.body.openingTime).toBe('09:00');
    expect(res.body.closingTime).toBe('18:00');
    expect(res.body.tourDuration).toBe(90);
  });

  it('POST /api/v1/places acepta coordinates "lat,long"', async () => {
    const payload: any = {
      name: 'Mirador del Sol',
      description: 'Vista panorámica para fotos',
      category: 'mirador',
      tags: ['instagrameable'],
      coordinates: '16.614497, -93.091983',
      address: 'Camino al mirador s/n',
      imageUrl: 'https://example.com/mirador.jpg',
      isHiddenGem: true,
    };

    const res = await request(app.getHttpServer())
      .post('/api/v1/places')
      .send(payload)
      .expect(201);

    expect(res.body.latitude).toBeCloseTo(16.614497, 6);
    expect(res.body.longitude).toBeCloseTo(-93.091983, 6);
    expect(res.body.name).toBe('Mirador del Sol');
  });

  it('GET /api/v1/places retorna paginado y contiene nuevos campos', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/places')
      .query({ page: 1, limit: 10 })
      .expect(200);

    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.meta).toEqual({
      page: 1,
      limit: 10,
      total: 1,
      totalPages: 1,
      hasPrevious: false,
      hasNext: false,
    });
    expect(res.body.data[0].openingTime).toBe('09:00');
    expect(res.body.data[0].closingTime).toBe('18:00');
    expect(res.body.data[0].tourDuration).toBe(90);
  });

  it('POST /api/v1/places/nearby retorna lista con distance', async () => {
    const nearby: NearbySearchDto = {
      latitude: -12.0464,
      longitude: -77.0428,
      radius: 5,
      limit: 10,
    };

    const res = await request(app.getHttpServer())
      .post('/api/v1/places/nearby')
      .send(nearby)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].distance).toBeDefined();
  });

  it('GET /api/v1/places/:id retorna un lugar', async () => {
    const id = 'abc-123';
    const res = await request(app.getHttpServer())
      .get(`/api/v1/places/${id}`)
      .expect(200);
    expect(res.body.id).toBe(id);
    expect(res.body.name).toBe('Museo de Historia');
  });

  it('PATCH /api/v1/places/:id actualiza horario y tour', async () => {
    const id = 'abc-123';
    const update: UpdatePlaceDto = {
      openingTime: '10:00',
      closingTime: '19:30',
      tourDuration: 75,
    };
    const res = await request(app.getHttpServer())
      .patch(`/api/v1/places/${id}`)
      .send(update)
      .expect(200);

    expect(res.body.id).toBe(id);
    expect(res.body.openingTime).toBe('10:00');
    expect(res.body.closingTime).toBe('19:30');
    expect(res.body.tourDuration).toBe(75);
  });

  it('PATCH /api/v1/places/:id/toggle-hidden-gem alterna el estado', async () => {
    const id = 'abc-123';
    const res = await request(app.getHttpServer())
      .patch(`/api/v1/places/${id}/toggle-hidden-gem`)
      .expect(200);
    expect(res.body.id).toBe(id);
    expect(res.body.isHiddenGem).toBe(true);
  });

  it('GET /api/v1/places/categories retorna categorías', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/places/categories')
      .expect(200);
    expect(res.body).toEqual(categories);
  });

  it('GET /api/v1/places/tags retorna etiquetas', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/places/tags')
      .expect(200);
    expect(res.body).toEqual(tags);
  });

  it('DELETE /api/v1/places/:id elimina un lugar', async () => {
    const id = 'abc-123';
    const res = await request(app.getHttpServer())
      .delete(`/api/v1/places/${id}`)
      .expect(200);
    expect(res.body).toEqual<DeleteResponseDto>({ id, deleted: true });
  });
});