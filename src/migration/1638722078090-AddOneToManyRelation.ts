import {MigrationInterface, QueryRunner} from "typeorm";

export class AddOneToManyRelation1638722078090 implements MigrationInterface {
    name = 'AddOneToManyRelation1638722078090'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`item\` ADD \`listId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`item\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`item\` ADD \`status\` enum ('active', 'done', 'cancelded') NOT NULL DEFAULT 'active'`);
        await queryRunner.query(`ALTER TABLE \`item\` ADD CONSTRAINT \`FK_7bd5f4d3ef52bfaa138ada4cf81\` FOREIGN KEY (\`listId\`) REFERENCES \`list\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`item\` DROP FOREIGN KEY \`FK_7bd5f4d3ef52bfaa138ada4cf81\``);
        await queryRunner.query(`ALTER TABLE \`item\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`item\` ADD \`status\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`item\` DROP COLUMN \`listId\``);
    }

}
