import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatedBaseEntity1759810210535 implements MigrationInterface {
    name = 'UpdatedBaseEntity1759810210535'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "one_time_operation" DROP CONSTRAINT "PK_9f267b774afffb65d73b143aa25"`);
        await queryRunner.query(`ALTER TABLE "one_time_operation" DROP COLUMN "transactionId"`);
        await queryRunner.query(`ALTER TABLE "one_time_operation" DROP COLUMN "initialAmount"`);
        await queryRunner.query(`ALTER TABLE "one_time_operation" DROP COLUMN "endAmount"`);
        await queryRunner.query(`ALTER TABLE "one_time_operation" DROP COLUMN "transactionType"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "createdBy" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "modifiedBy" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "attribute_master" ADD "createdBy" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "attribute_master" ADD "modifiedBy" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD "createdBy" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD "modifiedBy" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "one_time_operation" ADD "id" bigint NOT NULL DEFAULT nextval('nextid')`);
        await queryRunner.query(`ALTER TABLE "one_time_operation" ADD CONSTRAINT "PK_b3fb9755cdab65ab47fc65f1b75" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "one_time_operation" ADD "createdBy" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "one_time_operation" ADD "modifiedBy" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "one_time_operation" ADD "operationId" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "one_time_operation" ADD CONSTRAINT "UQ_7baf63e75ecde4f0fd608c2402e" UNIQUE ("operationId")`);
        await queryRunner.query(`ALTER TABLE "one_time_operation" ADD "dataType" character varying(10) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "operations" ADD "createdBy" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "operations" ADD "modifiedBy" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "createdBy" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "modifiedBy" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "one_time_operation" DROP COLUMN "dateCreated"`);
        await queryRunner.query(`ALTER TABLE "one_time_operation" ADD "dateCreated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "one_time_operation" DROP COLUMN "dateModified"`);
        await queryRunner.query(`ALTER TABLE "one_time_operation" ADD "dateModified" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "one_time_operation" DROP COLUMN "dateModified"`);
        await queryRunner.query(`ALTER TABLE "one_time_operation" ADD "dateModified" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "one_time_operation" DROP COLUMN "dateCreated"`);
        await queryRunner.query(`ALTER TABLE "one_time_operation" ADD "dateCreated" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "modifiedBy"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "createdBy"`);
        await queryRunner.query(`ALTER TABLE "operations" DROP COLUMN "modifiedBy"`);
        await queryRunner.query(`ALTER TABLE "operations" DROP COLUMN "createdBy"`);
        await queryRunner.query(`ALTER TABLE "one_time_operation" DROP COLUMN "dataType"`);
        await queryRunner.query(`ALTER TABLE "one_time_operation" DROP CONSTRAINT "UQ_7baf63e75ecde4f0fd608c2402e"`);
        await queryRunner.query(`ALTER TABLE "one_time_operation" DROP COLUMN "operationId"`);
        await queryRunner.query(`ALTER TABLE "one_time_operation" DROP COLUMN "modifiedBy"`);
        await queryRunner.query(`ALTER TABLE "one_time_operation" DROP COLUMN "createdBy"`);
        await queryRunner.query(`ALTER TABLE "one_time_operation" DROP CONSTRAINT "PK_b3fb9755cdab65ab47fc65f1b75"`);
        await queryRunner.query(`ALTER TABLE "one_time_operation" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "modifiedBy"`);
        await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "createdBy"`);
        await queryRunner.query(`ALTER TABLE "attribute_master" DROP COLUMN "modifiedBy"`);
        await queryRunner.query(`ALTER TABLE "attribute_master" DROP COLUMN "createdBy"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "modifiedBy"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdBy"`);
        await queryRunner.query(`ALTER TABLE "one_time_operation" ADD "transactionType" character varying(10) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "one_time_operation" ADD "endAmount" numeric(20,4) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "one_time_operation" ADD "initialAmount" numeric(20,4) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "one_time_operation" ADD "transactionId" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "one_time_operation" ADD CONSTRAINT "PK_9f267b774afffb65d73b143aa25" PRIMARY KEY ("transactionId")`);
    }

}
