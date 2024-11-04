import { MigrationInterface, QueryRunner } from "typeorm";

export class RefreshToken1730120303215 implements MigrationInterface {
    name = 'RefreshToken1730120303215'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`refresh_tokens\` (\`uuid\` varchar(36) NOT NULL, \`token\` varchar(50) NOT NULL, \`user_uuid\` varchar(255) NOT NULL, \`replaced_by\` varchar(255) NULL, \`revoked_at\` datetime NULL, \`expires_at\` datetime NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_4542dd2f38a61354a040ba9fd5\` (\`token\`), PRIMARY KEY (\`uuid\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`refresh_tokens\` ADD CONSTRAINT \`FK_3915b0c1f048695de436e49dc33\` FOREIGN KEY (\`user_uuid\`) REFERENCES \`user\`(\`uuid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`refresh_tokens\` DROP FOREIGN KEY \`FK_3915b0c1f048695de436e49dc33\``);
        await queryRunner.query(`DROP INDEX \`IDX_4542dd2f38a61354a040ba9fd5\` ON \`refresh_tokens\``);
        await queryRunner.query(`DROP TABLE \`refresh_tokens\``);
    }

}
