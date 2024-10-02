import {
    IsArray,
    IsBoolean,
    IsInt,
    IsNumber,
    Length,
    ArrayNotEmpty,
} from "class-validator";

export class UpdateBrandDto {
    @IsNumber()
    id: number;

    @Length(2, 30)
    name: string;

    logo: string;

    @IsArray()
    // @ArrayNotEmpty()
    @IsInt({ each: true }) // Ensure each value in the array is an integer
    category_ids: number[];

    @IsBoolean()
    active: boolean;
}
