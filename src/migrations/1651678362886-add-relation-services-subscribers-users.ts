import { MigrationInterface, QueryRunner } from 'typeorm';

export class addRelationUsersServices1651609229289
    implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE services_subscribers_users
            (
                service_id integer NOT NULL,
                user_id integer NOT NULL,
                CONSTRAINT pk_users_services
                PRIMARY KEY(service_id, user_id)
            )`);

        await queryRunner.query(
            `ALTER TABLE services_subscribers_users ADD CONSTRAINT fk_services FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE services_subscribers_users ADD CONSTRAINT fk_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `ALTER TABLE services_subscribers_users DROP CONSTRAINT "fk_users"`,
        );
        await queryRunner.query(
            `ALTER TABLE services_subscribers_users DROP CONSTRAINT "fk_services"`,
        );
        await queryRunner.query(`DROP TABLE services_subscribers_users`);
    }
}
