import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOpeningClosingTourduration1710000000000 implements MigrationInterface {
  name = 'AddOpeningClosingTourduration1710000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "places" ADD COLUMN "openingTime" TIME`);
    await queryRunner.query(`ALTER TABLE "places" ADD COLUMN "closingTime" TIME`);
    await queryRunner.query(`ALTER TABLE "places" ADD COLUMN "tourDuration" INTEGER`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "places" DROP COLUMN "tourDuration"`);
    await queryRunner.query(`ALTER TABLE "places" DROP COLUMN "closingTime"`);
    await queryRunner.query(`ALTER TABLE "places" DROP COLUMN "openingTime"`);
  }
}