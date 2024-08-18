import { IsNumber } from "class-validator";

export class UpadteImageDto {

    @IsNumber()
    id: number;

    image_path: string;
}