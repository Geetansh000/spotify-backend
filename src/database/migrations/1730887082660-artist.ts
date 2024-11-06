import { MigrationInterface, QueryRunner } from "typeorm";

export class Artist1730887082660 implements MigrationInterface {
    name = 'Artist1730887082660'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`artist\` (\`uuid\` varchar(36) NOT NULL, \`artistName\` varchar(255) NOT NULL, \`image\` varchar(255) NULL, \`user_uuid\` varchar(36) NULL, UNIQUE INDEX \`REL_e91fbc3db7fc723139b4351d34\` (\`user_uuid\`), PRIMARY KEY (\`uuid\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`artist\` ADD CONSTRAINT \`FK_e91fbc3db7fc723139b4351d341\` FOREIGN KEY (\`user_uuid\`) REFERENCES \`user\`(\`uuid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`artist\` DROP FOREIGN KEY \`FK_e91fbc3db7fc723139b4351d341\``);
        await queryRunner.query(`DROP INDEX \`REL_e91fbc3db7fc723139b4351d34\` ON \`artist\``);
        await queryRunner.query(`DROP TABLE \`artist\``);
    }

}
