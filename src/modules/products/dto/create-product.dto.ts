import { IsNotEmpty, IsNumber, IsString, Length, Min } from "class-validator";

export class CreateProductDto {

    @IsNotEmpty()
    @IsString()
    @Length(2, 100)
    name: string;

    @IsNotEmpty()
    @IsNumber()
    brand_id: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    discount_percentage: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    price: number;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    specifications: string;

    @IsNotEmpty()
    @IsString()
    default_image: string;

    images: string[];

    // ======
    @IsNotEmpty()
    @IsNumber()
    category_id: number;
}