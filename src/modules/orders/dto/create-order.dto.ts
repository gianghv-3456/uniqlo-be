import { IsBoolean, IsEmail, IsEmpty, IsNotEmpty, IsNumber, IsString, Length } from "class-validator";

export class CreateOrderDto {

    @IsNumber()
    account_id: number;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    address: string;

    @IsNotEmpty()
    @Length(10, 10)
    phone: string;

    email?: string;

    @IsNotEmpty()
    @IsNumber()
    total: number;

    note?: string;

    @IsNotEmpty()
    @IsBoolean()
    pay: boolean;
}