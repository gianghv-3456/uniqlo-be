import { Length } from "class-validator";

export class UpdatePasswordDto {
    @Length(6, 30)
    oldPassword: string;

    @Length(6, 30)
    newPassword: string;
}