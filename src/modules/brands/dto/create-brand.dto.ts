import {
    ArrayNotEmpty,
    IsArray,
    IsInt,
    IsNumber,
    IsString,
    Length,
} from "class-validator";

export class CreateBrandDto {
    @Length(2, 30)
    name: string;

    logo: string;

    @IsArray()
    // @ArrayNotEmpty()
    @IsInt({ each: true }) // Ensures each value in the array is an integer
    category_ids: number[];
}
