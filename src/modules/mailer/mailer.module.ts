import { Module } from "@nestjs/common";
import { MailerController } from "./mailer.controller";
import { MailerService } from "./mailer.service";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Account } from "../accounts/entity/account.entity";

@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forFeature([Account])
    ],
    controllers: [MailerController],
    providers: [MailerService]
})
export class MailerModule { }