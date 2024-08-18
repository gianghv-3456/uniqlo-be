import { IsBoolean, IsNumber, Length } from "class-validator";

export class UpdateCategoryDto {

    @IsNumber()
    id: number;

    @Length(4, 30)
    name: string;

    @IsBoolean()
    active: boolean;
}