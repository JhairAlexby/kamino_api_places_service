import * as typeorm from 'typeorm';

export class AddOpeningClosingTourDurationToPlaces20251111120000 implements typeorm.MigrationInterface {
  name = 'AddOpeningClosingTourDurationToPlaces20251111120000';

  public async up(queryRunner: typeorm.QueryRunner): Promise<void> {
    const hasPlacesTable = await queryRunner.hasTable('places');
    if (!hasPlacesTable) {
      // Si la tabla no existe (por ejemplo en dev con synchronize), omitimos esta migración
      return;
    }
    const table = await queryRunner.getTable('places');

    if (!table?.findColumnByName('openingTime')) {
      await queryRunner.addColumn(
        'places',
        new typeorm.TableColumn({
          name: 'openingTime',
          type: 'time',
          isNullable: true,
        }),
      );
    }

    if (!table?.findColumnByName('closingTime')) {
      await queryRunner.addColumn(
        'places',
        new typeorm.TableColumn({
          name: 'closingTime',
          type: 'time',
          isNullable: true,
        }),
      );
    }

    if (!table?.findColumnByName('tourDuration')) {
      await queryRunner.addColumn(
        'places',
        new typeorm.TableColumn({
          name: 'tourDuration',
          type: 'integer',
          isNullable: true,
        }),
      );
    }
  }

  public async down(queryRunner: typeorm.QueryRunner): Promise<void> {
    const hasPlacesTable = await queryRunner.hasTable('places');
    if (!hasPlacesTable) {
      return;
    }
    const table = await queryRunner.getTable('places');
    if (table?.findColumnByName('tourDuration')) {
      await queryRunner.dropColumn('places', 'tourDuration');
    }
    if (table?.findColumnByName('closingTime')) {
      await queryRunner.dropColumn('places', 'closingTime');
    }
    if (table?.findColumnByName('openingTime')) {
      await queryRunner.dropColumn('places', 'openingTime');
    }
  }
}