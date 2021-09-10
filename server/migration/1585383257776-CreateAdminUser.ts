import {MigrationInterface, QueryRunner, getRepository} from "typeorm";
import { Users } from "../entities";
export class CreateAdminUser1585383257776 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        let user = new Users();
        user.Email = "sabash.c@blaze.ws";
        user.Password = "admin@blaze";
        user.hashPassword();
       // user.role = "ADMIN";
        const userRepository = getRepository(Users);
        await userRepository.save(user);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
