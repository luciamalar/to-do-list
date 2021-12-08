import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeItemStatus1638869576825 implements MigrationInterface {
    name = 'ChangeItemStatus1638869576825'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`item\` CHANGE \`status\` \`status\` enum ('active', 'done', 'cancelled') NOT NULL DEFAULT 'active'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`item\` CHANGE \`status\` \`status\` enum ('active', 'done', 'cancelded') NOT NULL DEFAULT 'active'`);
    }

}
