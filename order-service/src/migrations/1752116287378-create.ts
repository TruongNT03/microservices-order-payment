import { MigrationInterface, QueryRunner } from "typeorm";

export class Create1752116287378 implements MigrationInterface {
    name = 'Create1752116287378'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "password" SET NOT NULL`);
    }

}
