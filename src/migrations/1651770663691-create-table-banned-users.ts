import { MigrationInterface, QueryRunner } from 'typeorm';

export class createTableBannedUsersEntity1651770663691
    implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE banned_users
            (
                id serial NOT NULL,
                service_id integer NOT NULL,
                user_id integer NOT NULL,
                CONSTRAINT pk_banned_users
                PRIMARY KEY(id)
            )`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE services_banned_users`);
    }
}
