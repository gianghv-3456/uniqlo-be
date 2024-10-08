import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from "@nestjs/common"
import { CartService } from "./cart.service"
import { CreateCartDto } from "./dto/create-cart.dto"
import { UpdateQuantityDto } from "./dto/update-quantity.dto"
import { ResponseBuilder2 } from "src/utils/response-builder-v2"
import { ResponseCodeEnum } from "src/common/constants/response-code.enum"

@Controller("v2/carts")
export class CartControllerV2 {
  constructor(private readonly cartService: CartService) {}

  @Get(":id")
  async getCartById(@Param("id", ParseIntPipe) id: number) {
    const result = <any>await this.cartService.getCartById(id)

    for (let i = 0; i < result.length; i++) {
      const data = await this.cartService.getProductByVariationId(
        result[i].variationId
      )
      result[i].variation = data
    }

    // return {
    //     statusCode: HttpStatus.OK,
    //     message: "Create successful cart",
    //     data: result
    // }
    return new ResponseBuilder2()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage("Get successful cart")
      .withData(result)
      .build()
  }

  @Post("create")
  async create(@Body() body: CreateCartDto) {
    const resultFind = await this.cartService.findByInfo(body)

    if (resultFind) {
      // throw new BadRequestException("Added products to the cart");
      return new ResponseBuilder2()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage("Added products to the cart")
        .build()
    }

    const result = await this.cartService.create(body)

    if (result.severity === "ERROR") {
      // throw new BadRequestException(result.detail);
      return new ResponseBuilder2()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(result.detail)
        .build()
    }

    // return {
    //     statusCode: HttpStatus.CREATED,
    //     message: "Create successful cart",
    //     data: result
    // }
    return new ResponseBuilder2()
      .withCode(ResponseCodeEnum.CREATED)
      .withMessage("Create successful cart")
      .withData(result)
      .build()
  }

  @Delete(":id")
  async delete(@Param("id", ParseIntPipe) id: number) {
    const result = await this.cartService.delete(id)

    if (result.affected !== 1) {
      // throw new BadRequestException("No delete");
      return new ResponseBuilder2()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage("No delete")
        .build()
    }

    // return {
    //     statusCode: HttpStatus.OK,
    //     message: "Delete successful cart",
    // }
    return new ResponseBuilder2()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage("Delete successful cart")
      .withData(result)
      .build()
  }

  @Put("update-quantity")
  async updateQuantity(@Body() body: UpdateQuantityDto) {
    const result = await this.cartService.updateQuantity(body)

    if (!result) {
      // throw new BadRequestException("No update");
      return new ResponseBuilder2()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage("No update")
        .build()
    }

    // return {
    //     statusCode: HttpStatus.OK,
    //     message: "Update successful cart",
    // }
    return new ResponseBuilder2()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage("Update successful cart")
      .withData(result)
      .build()
  }
}
