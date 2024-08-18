import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpadteImageDto } from "./dto/update-image.dto";

@Controller('products')
export class ProductController {

    constructor(private readonly productService: ProductService) { };

    @Get()
    async getAll() {
        const result = await this.productService.getAll();
        result.sort((a, b) => a.id - b.id);
        return {
            statusCode: HttpStatus.OK,
            message: "Get successful product",
            data: result
        }
    }

    @Get(':id')
    async getById(@Param('id', ParseIntPipe) id: number) {

        const result = await this.productService.getById(id);

        return {
            statusCode: HttpStatus.OK,
            message: "Get successful product",
            data: result
        }
    }

    @Post('create')
    async create(@Body() body: CreateProductDto) {
        const result = await this.productService.create(body);

        if (result?.severity === "ERROR") {
            throw new BadRequestException(result.detail);
        }

        const { images } = body;
        const productImages = images.filter(image => image !== "");

        if (productImages.length > 0) {
            try {
                await this.productService.createImages(result[0], productImages);
            } catch (error) {
                console.log(error);
            }
        }

        return {
            statusCode: HttpStatus.CREATED,
            message: "Create successful product",
            data: result
        }
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {

        // const resultDeleteImages = await this.productService.deleteImages(id);

        const result = await this.productService.delete(id);

        return {
            statusCode: HttpStatus.OK,
            message: "Delete successful product",
            data: result
        }
    }

    @Put('update-image')
    async updateImage(@Body() body: UpadteImageDto) {

        const result = await this.productService.updateImage(body);

        if (result?.severity === "ERROR") {
            throw new BadRequestException(result.detail);
        }

        return {
            statusCode: HttpStatus.OK,
            message: "Update successful image",
        }
    }

    @Put('update')
    async update(@Body() body: any) {

        body.discountPercentage = body.discount_percentage;
        delete body.discount_percentage;

        const result = await this.productService.update(body);

        if (result?.severity === "ERROR") {
            throw new BadRequestException(result.detail);
        }

        return {
            statusCode: HttpStatus.OK,
            message: "Update successful product",
            data: "oke"
        }
    }
}