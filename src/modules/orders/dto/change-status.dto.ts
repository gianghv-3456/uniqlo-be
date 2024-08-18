import { IsEnum, IsNumber } from "class-validator";

export class ChangeStatusDto {

    @IsNumber()
    id: number;

    @IsEnum(['pending', 'accept', 'user_deny', 'admin_deny'])
    status: string;
}