import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { VariationService } from "./variation.service";
import { CreateVariationDto } from "./dto/create-variation.dto";
import { UpdateVariationDto } from "./dto/update-variation.dto";

@Controller('variations')
export class VariationController {

    constructor(private readonly variationService: VariationService) { };

    @Get()
    async getAll() {
        const result = await this.variationService.getAll();

        return {
            statusCode: HttpStatus.OK,
            message: "Get successful variation",
            data: result
        }
    }

    @Get('product-id/:id')
    async getVariationByProductId(@Param('id', ParseIntPipe) id: number) {

        const result = await this.variationService.getByProductId(id);

        const newReult = result.map(item => {
            item.price = parseFloat(item.price as any)
            return item
        })

        return {
            statusCode: HttpStatus.OK,
            message: "Get successful variation",
            data: newReult
        };
    }

    @Post('create')
    async create(@Body() body: CreateVariationDto) {
        const result = await this.variationService.create(body);

        if (result?.severity === "ERROR") {
            throw new BadRequestException(result.detail);
        }

        return {
            statusCode: HttpStatus.CREATED,
            message: "Create successful variation",
            data: result
        }
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {

        const result = await this.variationService.delete(id);

        return {
            statusCode: HttpStatus.OK,
            message: "Delete successful product",
        }
    }

    @Put('update')
    async update(@Body() body: UpdateVariationDto) {
        const result = await this.variationService.update(body);

        if (result.severity === "ERROR") {
            throw new BadRequestException(result.detail);
        }

        return {
            statusCode: HttpStatus.OK,
            message: "Update successful image",
            data: result
        }
    }
}