import { MigrationInterface, QueryRunner } from 'typeorm';

export class createServicesTable1651609208398 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE services
        (
          id serial NOT NULL,
          title text UNIQUE NOT NULL,
          description text NOT NULL DEFAULT '',
          CONSTRAINT service_pkey PRIMARY KEY (id)
        )`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE services`);
    }
}
