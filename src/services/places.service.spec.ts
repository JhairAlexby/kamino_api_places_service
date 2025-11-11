import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlacesService } from './places.service';
import { Place } from '../entities/place.entity';
import { CreatePlaceDto } from '../dto/create-place.dto';

describe('PlacesService', () => {
  let service: PlacesService;
  let repo: Repository<Place>;

  const repoMock = {
    create: jest.fn((dto) => ({ ...dto, id: 'uuid-1' })),
    save: jest.fn(async (place) => ({ ...place })),
    findOne: jest.fn(async ({ where: { id } }: any) => ({ id, openingTime: '08:00', closingTime: '18:00' })),
  } as unknown as Repository<Place>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlacesService,
        { provide: getRepositoryToken(Place), useValue: repoMock },
      ],
    }).compile();

    service = module.get<PlacesService>(PlacesService);
    repo = module.get<Repository<Place>>(getRepositoryToken(Place));
    jest.clearAllMocks();
  });

  it('debe lanzar error si closingTime <= openingTime en create()', async () => {
    const dto: CreatePlaceDto = {
      name: 'Lugar',
      description: 'Desc',
      category: 'cat',
      latitude: 0,
      longitude: 0,
      address: 'dir',
      openingTime: '10:00',
      closingTime: '09:00',
      isHiddenGem: false,
    } as any;
    await expect(service.create(dto)).rejects.toBeInstanceOf(BadRequestException);
  });

  it('debe crear cuando closingTime > openingTime', async () => {
    const dto: CreatePlaceDto = {
      name: 'Lugar',
      description: 'Desc',
      category: 'cat',
      latitude: 0,
      longitude: 0,
      address: 'dir',
      openingTime: '08:00',
      closingTime: '18:00',
      isHiddenGem: false,
      tourDuration: 60,
    } as any;
    const res = await service.create(dto);
    expect(res).toBeDefined();
    expect(repoMock.create).toHaveBeenCalled();
    expect(repoMock.save).toHaveBeenCalled();
  });

  it('update() debe validar closingTime > openingTime considerando valores existentes', async () => {
    await expect(service.update('uuid-1', { closingTime: '07:00' } as any)).rejects.toBeInstanceOf(BadRequestException);
  });
});