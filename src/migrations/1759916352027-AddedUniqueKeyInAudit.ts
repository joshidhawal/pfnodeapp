import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedUniqueKeyInAudit1759916352027 implements MigrationInterface {
    name = 'AddedUniqueKeyInAudit1759916352027'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auditvalidations" ADD CONSTRAINT "UQ_0ed5827f30628c5fd5856beb1da" UNIQUE ("auditId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auditvalidations" DROP CONSTRAINT "UQ_0ed5827f30628c5fd5856beb1da"`);
    }

}
