import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from 'nodemailer';
import { SendMailDto } from "./mailer.dto";
import Mail from "nodemailer/lib/mailer";
import { InjectRepository } from "@nestjs/typeorm";
import { Account } from "../accounts/entity/account.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class MailerService {

    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(Account) private readonly accountRepository: Repository<Account>,
        private readonly dataSource: DataSource
    ) { };

    mailTransport() {
        const transporter = nodemailer.createTransport({
            host: this.configService.get<string>('MAIL_HOST'),
            port: +this.configService.get<number>('MAIL_PORT'),
            secure: false, // Use `true` for port 465, `false` for all other ports
            auth: {
                user: this.configService.get<string>('MAIL_USER'),
                pass: this.configService.get<string>('MAIL_PASSWORD'),
            },
        });

        return transporter;
    }

    async sendMail(sendMailDto: SendMailDto) {
        const { from, recipients, subject, html, placeholderReplacements } = sendMailDto;

        const transport = this.mailTransport();

        const option: Mail.Options = {
            from: from ?? {
                name: this.configService.get<string>('APP_NAME'),
                address: this.configService.get<string>('DEFAULT_MAIL_FROM')
            },
            to: recipients,
            subject,
            html
        };

        try {
            const result = await transport.sendMail(option);
            return result;
        } catch (error) {
            console.log("Error send mail ===>>> ::: ", error);
        }
    }

    async getAccountByEmail(email: string) {
        return await this.accountRepository.findOne({ where: { email }, select: ['id', 'name', 'email'] });
    }

    async updateResetPassword(account: Account, passwordResetHash: string) {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const result = await queryRunner.manager.query(`UPDATE accounts SET password_reset=$1 WHERE id = $2;`, [passwordResetHash, account.id]);
            await queryRunner.commitTransaction();
            return result;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            console.log(err);
            return err;
        } finally {
            await queryRunner.release();
        }
    }
}