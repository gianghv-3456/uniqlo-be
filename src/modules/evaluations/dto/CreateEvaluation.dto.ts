import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateEvaluationDto {

    @IsNotEmpty()
    @IsNumber()
    star: number;

    @IsNotEmpty()
    @IsString()
    content: string;

    @IsNotEmpty()
    @IsNumber()
    productId: number;

    @IsNotEmpty()
    @IsNumber()
    accountId: number;
}