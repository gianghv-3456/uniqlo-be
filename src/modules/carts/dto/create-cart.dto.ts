import { IsNotEmpty, IsNumber } from "class-validator"

export class CreateCartDto {
  @IsNotEmpty()
  @IsNumber()
  account_id: number

  @IsNotEmpty()
  @IsNumber()
  variation_id: number

  @IsNotEmpty()
  size: string

  @IsNotEmpty()
  @IsNumber()
  quantity: number
}
