import { Transform } from "class-transformer";
import { IsEmail, IsEnum, IsNotEmpty, IsString, Length } from "class-validator"
import { ROLE } from "src/common/constants/role.enum";

export class LoginDto {

    @IsEmail()
    email: string;

    // @IsString()
    // @Length(6, 30)
    password: string;

    @IsEnum(ROLE)
    role: string;
}