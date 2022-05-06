import { MigrationInterface, QueryRunner } from 'typeorm';

export class createUsersTable1651609198889 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE users
        (
            id serial NOT NULL,
            username text UNIQUE NOT NULL,
            email text UNIQUE NOT NULL,
            password text NOT NULL,
            CONSTRAINT users_pkey PRIMARY KEY (id)
        )`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE users`);
    }
}
