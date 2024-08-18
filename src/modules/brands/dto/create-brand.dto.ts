import { IsNumber, IsString, Length } from "class-validator";

export class CreateBrandDto {

    @Length(2, 30)
    name: string;

    logo: string;

    @IsNumber()
    category_id: number;
}