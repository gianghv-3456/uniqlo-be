import { IsEmail, IsNotEmpty } from "class-validator";
import { Address } from "nodemailer/lib/mailer";

export class SendMailDto {

    from?: Address;
    recipients: Address[];
    subject: string;
    html: string;
    text?: string;
    placeholderReplacements?: Record<string, string>;
}

export class UserContactDto {

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    subject: string;

    @IsNotEmpty()
    message: string;
}

export class UserForgotPassword {
    @IsNotEmpty()
    @IsEmail()
    email: string;
}