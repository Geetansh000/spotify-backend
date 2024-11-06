import { MigrationInterface, QueryRunner } from "typeorm";

export class ArtistActvie1730890802058 implements MigrationInterface {
    name = 'ArtistActvie1730890802058'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`artist\` ADD \`is_active\` tinyint NOT NULL DEFAULT 1`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`artist\` DROP COLUMN \`is_active\``);
    }

}
