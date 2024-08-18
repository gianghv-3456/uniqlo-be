import { IsEmail, IsEnum, IsNotEmpty, Length } from "class-validator";
import { GENDER } from "src/common/constants/role.enum";

export class AcocuntUpdateDto {

    id?: number;

    @Length(4, 30)
    name: string;

    @Length(10, 10)
    phone: string;

    @IsEmail()
    email: string;

    @IsEnum(GENDER)
    gender: string;

    @IsNotEmpty()
    imagePath: string;
}