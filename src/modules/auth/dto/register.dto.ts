import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class RegisterDto {

    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    @IsString()
    birthday: string;
}