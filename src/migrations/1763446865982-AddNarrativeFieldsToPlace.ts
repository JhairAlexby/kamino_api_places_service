import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNarrativeFieldsToPlace1763446865982 implements MigrationInterface {
    name = 'AddNarrativeFieldsToPlace1763446865982'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "places"
            ADD COLUMN "closed_days" TEXT,
            ADD COLUMN "schedule_by_day" JSONB,
            ADD COLUMN "crowd_info" JSONB
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "places"
            DROP COLUMN "closed_days",
            DROP COLUMN "schedule_by_day",
            DROP COLUMN "crowd_info"
          `);
    }

}
