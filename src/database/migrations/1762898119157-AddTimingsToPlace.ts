import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddTimingsToPlace1762898119157 implements MigrationInterface {
    name = 'AddTimingsToPlace1762898119157'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("places", new TableColumn({
            name: "openingTime",
            type: "varchar",
            length: "50",
            isNullable: true,
        }));
        await queryRunner.addColumn("places", new TableColumn({
            name: "closingTime",
            type: "varchar",
            length: "50",
            isNullable: true,
        }));
        await queryRunner.addColumn("places", new TableColumn({
            name: "tourDuration",
            type: "integer",
            isNullable: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("places", "tourDuration");
        await queryRunner.dropColumn("places", "closingTime");
        await queryRunner.dropColumn("places", "openingTime");
    }

}
