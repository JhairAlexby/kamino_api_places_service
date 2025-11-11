import { validate } from 'class-validator';
import { CreatePlaceDto } from './create-place.dto';

describe('CreatePlaceDto', () => {
  it('debe rechazar formato inválido de tiempo', async () => {
    const dto = new CreatePlaceDto();
    dto.name = 'Lugar';
    dto.description = 'Desc';
    dto.category = 'cat';
    dto.latitude = 0;
    dto.longitude = 0;
    dto.address = 'dir';
    dto.openingTime = '25:00';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('debe aceptar HH:mm y HH:mm:ss', async () => {
    const dto1 = new CreatePlaceDto();
    dto1.name = 'Lugar';
    dto1.description = 'Desc';
    dto1.category = 'cat';
    dto1.latitude = 0;
    dto1.longitude = 0;
    dto1.address = 'dir';
    dto1.openingTime = '08:30';
    let errors = await validate(dto1);
    expect(errors.find(e => e.property === 'openingTime')).toBeUndefined();

    const dto2 = new CreatePlaceDto();
    dto2.name = 'Lugar';
    dto2.description = 'Desc';
    dto2.category = 'cat';
    dto2.latitude = 0;
    dto2.longitude = 0;
    dto2.address = 'dir';
    dto2.openingTime = '08:30:15';
    errors = await validate(dto2);
    expect(errors.find(e => e.property === 'openingTime')).toBeUndefined();
  });

  it('debe rechazar tourDuration <= 0', async () => {
    const dto = new CreatePlaceDto();
    dto.name = 'Lugar';
    dto.description = 'Desc';
    dto.category = 'cat';
    dto.latitude = 0;
    dto.longitude = 0;
    dto.address = 'dir';
    dto.tourDuration = 0;
    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'tourDuration')).toBeTruthy();
  });
});