import { Module } from '@nestjs/common';
import { PostgresModule } from 'src/database/postgres.module';
import { Modules } from './modules';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot(),
        PostgresModule,
        ...Modules,
    ],
})
export class AppModule { }
