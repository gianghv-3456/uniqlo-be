import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: 'secretpass',
            database: 'uniqlo',
            entities: [],
            autoLoadEntities: true,
            synchronize: true
        })
    ]
})
export class PostgresModule { }