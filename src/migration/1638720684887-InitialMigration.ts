import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialMigration1638720684887 implements MigrationInterface {
    name = 'InitialMigration1638720684887'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`item\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(100) NOT NULL, \`description\` text NOT NULL, \`deadline\` datetime NOT NULL, \`status\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`list\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_14fe29fd07723dd6492e26c07f\` (\`title\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_lists_list\` (\`userId\` int NOT NULL, \`listId\` int NOT NULL, INDEX \`IDX_ca37e593473d3b70e941a9f8f1\` (\`userId\`), INDEX \`IDX_56cc5740e5acd4ec2cb34587bf\` (\`listId\`), PRIMARY KEY (\`userId\`, \`listId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_lists_list\` ADD CONSTRAINT \`FK_ca37e593473d3b70e941a9f8f16\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_lists_list\` ADD CONSTRAINT \`FK_56cc5740e5acd4ec2cb34587bf4\` FOREIGN KEY (\`listId\`) REFERENCES \`list\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_lists_list\` DROP FOREIGN KEY \`FK_56cc5740e5acd4ec2cb34587bf4\``);
        await queryRunner.query(`ALTER TABLE \`user_lists_list\` DROP FOREIGN KEY \`FK_ca37e593473d3b70e941a9f8f16\``);
        await queryRunner.query(`DROP INDEX \`IDX_56cc5740e5acd4ec2cb34587bf\` ON \`user_lists_list\``);
        await queryRunner.query(`DROP INDEX \`IDX_ca37e593473d3b70e941a9f8f1\` ON \`user_lists_list\``);
        await queryRunner.query(`DROP TABLE \`user_lists_list\``);
        await queryRunner.query(`DROP INDEX \`IDX_14fe29fd07723dd6492e26c07f\` ON \`list\``);
        await queryRunner.query(`DROP TABLE \`list\``);
        await queryRunner.query(`DROP INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`item\``);
    }

}
