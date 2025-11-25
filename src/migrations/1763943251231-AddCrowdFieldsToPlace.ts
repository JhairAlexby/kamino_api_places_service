import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCrowdFieldsToPlace1763943251231 implements MigrationInterface {
    name = 'AddCrowdFieldsToPlace1763943251231'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "places" ADD "closedDays" text`);
        await queryRunner.query(`ALTER TABLE "places" ADD "scheduleByDay" jsonb`);
        await queryRunner.query(`ALTER TABLE "places" ADD "crowdInfo" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "places" DROP COLUMN "crowdInfo"`);
        await queryRunner.query(`ALTER TABLE "places" DROP COLUMN "scheduleByDay"`);
        await queryRunner.query(`ALTER TABLE "places" DROP COLUMN "closedDays"`);
    }

}
