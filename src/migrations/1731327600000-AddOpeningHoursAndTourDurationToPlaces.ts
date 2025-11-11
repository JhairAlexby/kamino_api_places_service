import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOpeningHoursAndTourDurationToPlaces1731327600000 implements MigrationInterface {
  name = 'AddOpeningHoursAndTourDurationToPlaces1731327600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "places" 
      ADD COLUMN "openingTime" TIME NULL,
      ADD COLUMN "closingTime" TIME NULL,
      ADD COLUMN "tourDuration" INTEGER NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "places" 
      DROP COLUMN "openingTime",
      DROP COLUMN "closingTime",
      DROP COLUMN "tourDuration"
    `);
  }
}