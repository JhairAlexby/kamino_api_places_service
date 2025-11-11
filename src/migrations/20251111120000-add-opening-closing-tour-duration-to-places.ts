import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddOpeningClosingTourDurationToPlaces20251111120000 implements MigrationInterface {
  name = 'AddOpeningClosingTourDurationToPlaces20251111120000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'places',
      new TableColumn({
        name: 'openingTime',
        type: 'time',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'places',
      new TableColumn({
        name: 'closingTime',
        type: 'time',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'places',
      new TableColumn({
        name: 'tourDuration',
        type: 'integer',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('places', 'tourDuration');
    await queryRunner.dropColumn('places', 'closingTime');
    await queryRunner.dropColumn('places', 'openingTime');
  }
}