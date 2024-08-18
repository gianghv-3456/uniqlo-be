import { BadRequestException, Body, Controller, HttpStatus, NotFoundException, Post } from "@nestjs/common";
import { MailerService } from "./mailer.service";
import { SendMailDto, UserContactDto, UserForgotPassword } from "./mailer.dto";
import * as bcrypt from "bcrypt";

@Controller('mailer')
export class MailerController {
    constructor(private readonly mailerService: MailerService) { };

    @Post('send-mail')
    async sendMail(@Body() contact: UserContactDto) {
        const dto: SendMailDto = {
            from: { name: `${contact.name}`, address: `${contact.email}` },
            recipients: [{ name: 'HVGiang86', address: 'hvgiang86@gmail.com' }],
            subject: `${contact.subject}`,
            html:
                `
                <p>${contact.message} !!!</p>
            `
        };

        try {
            const resultJSON = await this.mailerService.sendMail(dto);

            return {
                statusCode: HttpStatus.OK,
                message: "Send mail success",
                data: resultJSON
            }

        } catch (error) {
            throw new BadRequestException(JSON.stringify(error));
        }
    }

    @Post('forgot-password')
    async forgotPassword(@Body() body: UserForgotPassword) {

        const accountFind = await this.mailerService.getAccountByEmail(body.email);

        if (!accountFind) {
            throw new NotFoundException("Not found email");
        }

        const passwordReset = Math.floor(Math.random() * 899999 + 100000).toString();
        const passwordResetHash = bcrypt.hashSync(passwordReset, bcrypt.genSaltSync());

        const resultUpdate = await this.mailerService.updateResetPassword(accountFind, passwordResetHash);

        if (Array.isArray(resultUpdate) && resultUpdate.length === 2) {

            const dto: SendMailDto = {
                from: { name: `HGiang`, address: `hvgiang86@gmail.com` },
                recipients: [{ name: 'User', address: `${body.email}` }],
                subject: `Reset password for Lipuma`,
                html:
                    `
                    <p>Your password reset:  ${passwordReset}</p>
                `
            };

            try {
                await this.mailerService.sendMail(dto);

                return {
                    statusCode: HttpStatus.OK,
                    message: "Success, open your mail",
                }

            } catch (error) {
                throw new BadRequestException(JSON.stringify(error));
            }
        } else {
            throw new BadRequestException("Error");
        }
    }
}