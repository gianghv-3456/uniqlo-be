import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { CartService } from "./cart.service";
import { CreateCartDto } from "./dto/create-cart.dto";
import { UpdateQuantityDto } from "./dto/update-quantity.dto";

@Controller('carts')
export class CartController {

    constructor(private readonly cartService: CartService) { };

    @Get(":id")
    async getCartById(@Param('id', ParseIntPipe) id: number) {

        const result = <any>await this.cartService.getCartById(id);

        for (let i = 0; i < result.length; i++) {
            const data = await this.cartService.getProductByVariationId(result[i].variationId);
            result[i].variation = data
        }

        return {
            statusCode: HttpStatus.OK,
            message: "Create successful cart",
            data: result
        }

    }

    @Post('create')
    async create(@Body() body: CreateCartDto) {

        const resultFind = await this.cartService.findByInfo(body);

        if (resultFind) {
            throw new BadRequestException("Added products to the cart");
        }

        const result = await this.cartService.create(body);

        if (result.severity === "ERROR") {
            throw new BadRequestException(result.detail);
        }

        return {
            statusCode: HttpStatus.CREATED,
            message: "Create successful cart",
            data: result
        }
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        const result = await this.cartService.delete(id);

        if (result.affected !== 1) {
            throw new BadRequestException("No delete");
        }

        return {
            statusCode: HttpStatus.OK,
            message: "Delete successful cart",
        }
    }

    @Put('update-quantity')
    async updateQuantity(@Body() body: UpdateQuantityDto) {

        const result = await this.cartService.updateQuantity(body);

        return {
            statusCode: HttpStatus.OK,
            message: "Update successful cart",
        }
    }
}