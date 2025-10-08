import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedAuditEntity21759916214096 implements MigrationInterface {
    name = 'AddedAuditEntity21759916214096'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "workingtransaction" ("id" bigint NOT NULL DEFAULT nextval('nextid'), "dateCreated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "dateModified" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" character varying(100) NOT NULL, "modifiedBy" character varying(100) NOT NULL, "transactionId" character varying(100) NOT NULL, "transactionDate" TIMESTAMP WITH TIME ZONE NOT NULL, "initialAmount" numeric(20,4) NOT NULL, "operationType" character varying(10) NOT NULL, "status" character varying(1) NOT NULL, "operatingAmount" numeric(20,4) NOT NULL, "endAmount" numeric(20,4) NOT NULL, "transactionType" character varying(10) NOT NULL, "userId" bigint, "accountId" bigint, CONSTRAINT "UQ_14ff2a4026285eb18c6330b903b" UNIQUE ("transactionId"), CONSTRAINT "PK_3d15dcacdea102ab4d3432d9667" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "auditvalidations" ("id" bigint NOT NULL DEFAULT nextval('nextid'), "dateCreated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "dateModified" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" character varying(100) NOT NULL, "modifiedBy" character varying(100) NOT NULL, "auditId" character varying(100) NOT NULL, "validationType" numeric(1,0) NOT NULL, "isLax" boolean NOT NULL DEFAULT false, "amount" numeric(20,4) NOT NULL, "dataType" character varying(10) NOT NULL, "userId" bigint, "accountId" bigint, CONSTRAINT "PK_7cf644ab6bc423aa0f85ad843a0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "transactionDate" TIMESTAMP WITH TIME ZONE NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "status" character varying(1) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "workingtransaction" ADD CONSTRAINT "FK_c13f2050cac0c9ddc8c892ed367" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "workingtransaction" ADD CONSTRAINT "FK_4b44819179b0a717e737e3b267c" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "auditvalidations" ADD CONSTRAINT "FK_bdbf0ece79f1c25d5108e70bb78" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "auditvalidations" ADD CONSTRAINT "FK_0c5ec8c6969bec638dcde1ea2dc" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auditvalidations" DROP CONSTRAINT "FK_0c5ec8c6969bec638dcde1ea2dc"`);
        await queryRunner.query(`ALTER TABLE "auditvalidations" DROP CONSTRAINT "FK_bdbf0ece79f1c25d5108e70bb78"`);
        await queryRunner.query(`ALTER TABLE "workingtransaction" DROP CONSTRAINT "FK_4b44819179b0a717e737e3b267c"`);
        await queryRunner.query(`ALTER TABLE "workingtransaction" DROP CONSTRAINT "FK_c13f2050cac0c9ddc8c892ed367"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "transactionDate"`);
        await queryRunner.query(`DROP TABLE "auditvalidations"`);
        await queryRunner.query(`DROP TABLE "workingtransaction"`);
    }

}
