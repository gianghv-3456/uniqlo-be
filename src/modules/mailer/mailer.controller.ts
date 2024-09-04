import {
    BadRequestException,
    Body,
    Controller,
    HttpStatus,
    NotFoundException,
    Post,
} from "@nestjs/common";
import { MailerService } from "./mailer.service";
import { SendMailDto, UserContactDto, UserForgotPassword } from "./mailer.dto";
import * as bcrypt from "bcrypt";
import { ResponseBuilder } from "src/utils/response-builder";
import { ResponseCodeEnum } from "src/common/constants/response-code.enum";

@Controller("mailer")
export class MailerController {
    constructor(private readonly mailerService: MailerService) {}

    @Post("send-mail")
    async sendMail(@Body() contact: UserContactDto) {
        const dto: SendMailDto = {
            from: { name: `${contact.name}`, address: `${contact.email}` },
            recipients: [{ name: "HVGiang86", address: "hvgiang86@gmail.com" }],
            subject: `${contact.subject}`,
            html: `
                <p>${contact.message} !!!</p>
            `,
        };

        try {
            const resultJSON = await this.mailerService.sendMail(dto);

            // return {
            //     statusCode: HttpStatus.OK,
            //     message: "Send mail success",
            //     data: resultJSON,
            // };
            return new ResponseBuilder()
                .withCode(ResponseCodeEnum.SUCCESS)
                .withMessage("Send mail success")
                .withData(resultJSON)
                .build();
        } catch (error) {
            // throw new BadRequestException(JSON.stringify(error));
            return new ResponseBuilder()
                .withCode(ResponseCodeEnum.BAD_REQUEST)
                .withMessage("Errors")
                .withData(JSON.stringify(error))
                .build();
        }
    }

    @Post("forgot-password")
    async forgotPassword(@Body() body: UserForgotPassword) {
        const accountFind = await this.mailerService.getAccountByEmail(
            body.email
        );

        if (!accountFind) {
            // throw new NotFoundException("Not found email");
            return new ResponseBuilder()
                .withCode(ResponseCodeEnum.NOT_FOUND)
                .withMessage("Not found email")
                .build();
        }

        const passwordReset = Math.floor(
            Math.random() * 899999 + 100000
        ).toString();
        const passwordResetHash = bcrypt.hashSync(
            passwordReset,
            bcrypt.genSaltSync()
        );

        const resultUpdate = await this.mailerService.updateResetPassword(
            accountFind,
            passwordResetHash
        );

        if (Array.isArray(resultUpdate) && resultUpdate.length === 2) {
            const dto: SendMailDto = {
                from: { name: `HGiang`, address: `hvgiang86@gmail.com` },
                recipients: [{ name: "User", address: `${body.email}` }],
                subject: `Reset password for Lipuma`,
                html: `
                    <p>Your password reset:  ${passwordReset}</p>
                `,
            };

            try {
                await this.mailerService.sendMail(dto);

                // return {
                //     statusCode: HttpStatus.OK,
                //     message: "Success, open your mail",
                // };
                return new ResponseBuilder()
                    .withCode(ResponseCodeEnum.SUCCESS)
                    .withMessage("Success, open your mail")
                    .build();
            } catch (error) {
                // throw new BadRequestException(JSON.stringify(error));
                return new ResponseBuilder()
                    .withCode(ResponseCodeEnum.BAD_REQUEST)
                    .withMessage("Errors")
                    .withData(JSON.stringify(error))
                    .build();
            }
        } else {
            // throw new BadRequestException("Error");
            return new ResponseBuilder()
                .withCode(ResponseCodeEnum.BAD_REQUEST)
                .withMessage("Error")
                .build();
        }
    }
}
