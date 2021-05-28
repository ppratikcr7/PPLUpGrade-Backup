import {MigrationInterface, QueryRunner} from "typeorm";

export class addStateTimeLogToExperiment1622183136314 implements MigrationInterface {
    name = 'addStateTimeLogToExperiment1622183136314'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "state_time_log" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "versionNumber" integer NOT NULL, "id" uuid NOT NULL, "fromState" "state_time_log_fromstate_enum" NOT NULL, "toState" "state_time_log_tostate_enum" NOT NULL, "timeLog" TIMESTAMP NOT NULL, "experimentId" uuid, CONSTRAINT "PK_760d29f7bfded82e5b51cfabb26" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "experiment" DROP COLUMN "startDate"`);
        await queryRunner.query(`ALTER TABLE "experiment" DROP COLUMN "endDate"`);
        await queryRunner.query(`ALTER TABLE "state_time_log" ADD CONSTRAINT "FK_aa0df63ad4adcf2e827eaad3338" FOREIGN KEY ("experimentId") REFERENCES "experiment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "state_time_log" DROP CONSTRAINT "FK_aa0df63ad4adcf2e827eaad3338"`);
        await queryRunner.query(`ALTER TABLE "experiment" ADD "endDate" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "experiment" ADD "startDate" TIMESTAMP`);
        await queryRunner.query(`DROP TABLE "state_time_log"`);
    }

}
