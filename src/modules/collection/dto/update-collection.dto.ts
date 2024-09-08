import {
    ArrayNotEmpty,
    IsArray,
    IsIn,
    IsInt,
    IsNotEmpty,
    IsString,
    Length,
} from "class-validator";

export class UpdateCollectionDto {
    @IsNotEmpty()
    @IsString()
    @Length(2, 100)
    title: string;

    @IsString()
    @Length(2, 100)
    description: string;

    @IsArray()
    @ArrayNotEmpty()
    @IsInt({ each: true })
    productIds: number[];
}
