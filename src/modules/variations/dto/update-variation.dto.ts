import { IsNumber, IsString } from "class-validator";

export class UpdateVariationDto {

    @IsNumber()
    id: number;

    @IsString()
    color: string;

    @IsNumber()
    price: number;

    @IsNumber()
    stock: number;

    image: string;
}