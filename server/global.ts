import * as redis from 'redis';
import { ConnectionOptions } from 'typeorm';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve('.env') })

var REDIS_URL = process.env.REDIS_URL;
export namespace Global {
    export var network: string =process.env.NODE_ENV=='development'?'Testnet':'Mainnet';
    // connect to Redis
    console.log(REDIS_URL);
    export var client = (REDIS_URL)?redis.createClient(REDIS_URL):'';

    export const dbConfig: ConnectionOptions = {
        type: 'mysql',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        synchronize: false,
        logging: true,
        //migrations: [__dirname +"/migration/*{.ts,.js}"],
        entities: [__dirname + '/entities/*{.ts,.js}'],
        cli: {
            entitiesDir: "server/models",
            migrationsDir: "server/migrations",
            subscribersDir: "server/subscribers"
          }
    };
  
}
