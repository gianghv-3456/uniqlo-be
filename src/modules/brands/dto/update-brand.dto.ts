import { IsBoolean, IsNumber, Length } from "class-validator";

export class UpdateBrandDto {

    @IsNumber()
    id: number;

    @Length(2, 30)
    name: string;

    logo: string;

    @IsNumber()
    category_id: number;

    @IsBoolean()
    active: boolean;
}