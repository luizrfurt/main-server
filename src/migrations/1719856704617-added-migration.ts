import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedMigration1719856704617 implements MigrationInterface {
    name = 'AddedMigration1719856704617'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "main"."sessions" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL, "active" boolean NOT NULL DEFAULT true, "access_token" character varying NOT NULL, "access_token_expires_in" TIMESTAMP NOT NULL, "refresh_token" character varying NOT NULL, "refresh_token_expires_in" TIMESTAMP NOT NULL, "userId" integer, CONSTRAINT "PK_3238ef96f18b355b671619111bc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "main"."users" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL, "active" boolean NOT NULL DEFAULT true, "name" character varying NOT NULL, "email" character varying NOT NULL, "login" character varying NOT NULL, "password" character varying NOT NULL, "photo" text DEFAULT 'https://prime-repo.s3.sa-east-1.amazonaws.com/main/users/default-user-photo.jpeg', "main" boolean NOT NULL DEFAULT false, "leader" boolean NOT NULL DEFAULT false, "email_confirmed" boolean NOT NULL DEFAULT false, "email_confirm_token" text, "email_confirm_token_expires" TIMESTAMP, "password_reseted" boolean NOT NULL DEFAULT false, "password_reset_token" text, "password_reset_token_expires" TIMESTAMP, "cpf" character varying, "phone" character varying, "created_by" integer, CONSTRAINT "UQ_2d443082eccd5198f95f2a36e2c" UNIQUE ("login"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "login_index" ON "main"."users" ("login") `);
        await queryRunner.query(`CREATE INDEX "emailConfirmToken_index" ON "main"."users" ("email_confirm_token") `);
        await queryRunner.query(`CREATE INDEX "passwordResetToken_index" ON "main"."users" ("password_reset_token") `);
        await queryRunner.query(`CREATE TABLE "main"."contexts" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL, "active" boolean NOT NULL DEFAULT true, "code" character varying NOT NULL, "description" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_c97319410dbb694c31c8feef53a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "main"."context_applications" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL, "active" boolean NOT NULL DEFAULT true, "contracted" boolean NOT NULL DEFAULT false, "contextId" integer, "applicationId" integer, "userId" integer, CONSTRAINT "PK_75ad98037267e127585e1a57e13" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "main"."applications" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL, "active" boolean NOT NULL DEFAULT true, "name" character varying NOT NULL, "description" character varying NOT NULL, "logo" text DEFAULT 'https://prime-repo.s3.sa-east-1.amazonaws.com/main/applications/default-application-logo.jpeg', CONSTRAINT "PK_938c0a27255637bde919591888f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "main"."terms_conditions" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL, "active" boolean NOT NULL DEFAULT true, "content" character varying NOT NULL, CONSTRAINT "PK_8646783cf3677db5157b4a1af76" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "main"."logs" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL, "active" boolean NOT NULL DEFAULT true, "ip" character varying, "user" character varying, "route" character varying, "data" text, CONSTRAINT "PK_fb1b805f2f7795de79fa69340ba" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "main"."sessions" ADD CONSTRAINT "FK_57de40bc620f456c7311aa3a1e6" FOREIGN KEY ("userId") REFERENCES "main"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "main"."contexts" ADD CONSTRAINT "FK_5de328bcdf55bbbeb83e1b266ce" FOREIGN KEY ("userId") REFERENCES "main"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "main"."context_applications" ADD CONSTRAINT "FK_f0526899fab178c76e16d7783b8" FOREIGN KEY ("contextId") REFERENCES "main"."contexts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "main"."context_applications" ADD CONSTRAINT "FK_e143af1b66055927726ed8989bf" FOREIGN KEY ("applicationId") REFERENCES "main"."applications"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "main"."context_applications" ADD CONSTRAINT "FK_52b116017eb87976d0e4c29baef" FOREIGN KEY ("userId") REFERENCES "main"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "main"."context_applications" DROP CONSTRAINT "FK_52b116017eb87976d0e4c29baef"`);
        await queryRunner.query(`ALTER TABLE "main"."context_applications" DROP CONSTRAINT "FK_e143af1b66055927726ed8989bf"`);
        await queryRunner.query(`ALTER TABLE "main"."context_applications" DROP CONSTRAINT "FK_f0526899fab178c76e16d7783b8"`);
        await queryRunner.query(`ALTER TABLE "main"."contexts" DROP CONSTRAINT "FK_5de328bcdf55bbbeb83e1b266ce"`);
        await queryRunner.query(`ALTER TABLE "main"."sessions" DROP CONSTRAINT "FK_57de40bc620f456c7311aa3a1e6"`);
        await queryRunner.query(`DROP TABLE "main"."logs"`);
        await queryRunner.query(`DROP TABLE "main"."terms_conditions"`);
        await queryRunner.query(`DROP TABLE "main"."applications"`);
        await queryRunner.query(`DROP TABLE "main"."context_applications"`);
        await queryRunner.query(`DROP TABLE "main"."contexts"`);
        await queryRunner.query(`DROP INDEX "main"."passwordResetToken_index"`);
        await queryRunner.query(`DROP INDEX "main"."emailConfirmToken_index"`);
        await queryRunner.query(`DROP INDEX "main"."login_index"`);
        await queryRunner.query(`DROP TABLE "main"."users"`);
        await queryRunner.query(`DROP TABLE "main"."sessions"`);
    }

}
