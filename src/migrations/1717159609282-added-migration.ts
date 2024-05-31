import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedMigration1717159609282 implements MigrationInterface {
    name = 'AddedMigration1717159609282'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "main"."termsConditions" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, "active" boolean NOT NULL DEFAULT true, "content" character varying NOT NULL, CONSTRAINT "PK_4f6a5336197049a0d379f62ee6a" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "main"."termsConditions"`);
    }

}
