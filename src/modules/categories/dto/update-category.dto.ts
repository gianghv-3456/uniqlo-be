import {
    IsArray,
    IsBoolean,
    IsInt,
    IsNumber,
    Length,
    ArrayNotEmpty,
} from "class-validator";

export class UpdateCategoryDto {
    @IsNumber()
    id: number;

    @Length(4, 30)
    name: string;

    @IsBoolean()
    active: boolean;

    @IsArray()
    // @ArrayNotEmpty()
    @IsInt({ each: true }) // Ensures each value in the array is an integer
    brand_ids: number[]; // Array of brand IDs to associate with the category
}
