import {
    IsArray,
    IsString,
    Length,
    ArrayNotEmpty,
    IsInt,
} from "class-validator";

export class CreateCategoryDto {
    @IsString()
    @Length(2, 30)
    name: string;

    @IsArray()
    // @ArrayNotEmpty()
    @IsInt({ each: true }) // Ensure each value in the array is an integer
    brand_ids: number[]; // Accept an array of brand IDs
}
