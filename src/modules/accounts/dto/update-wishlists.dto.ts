import { IsBoolean, IsNumber } from "class-validator"

export class UpdateWishlistDto {
  id?: number

  @IsNumber()
  accountId: number

  @IsNumber()
  productId: number

  @IsBoolean()
  isFavorite: boolean
}
