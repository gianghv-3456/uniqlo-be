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
} from "@nestjs/common";
import { BrandService } from "./brand.service";
import { CreateBrandDto } from "./dto/create-brand.dto";
import { UpdateBrandDto } from "./dto/update-brand.dto";
import { ResponseBuilder } from "src/utils/response-builder";
import { ResponseCodeEnum } from "src/common/constants/response-code.enum";

@Controller("brands")
export class BrandController {
    constructor(private readonly brandService: BrandService) {}

    @Get()
    async getAll() {
        const result = await this.brandService.getAll();
        result.sort((a, b) => a.id - b.id);
        // return {
        //     statusCode: HttpStatus.OK,
        //     message: "Get successful brand",
        //     data: result
        // }
        return new ResponseBuilder()
            .withCode(ResponseCodeEnum.SUCCESS)
            .withMessage("Get successful brand")
            .withData(result)
            .build();
    }

    @Post("create")
    async create(@Body() body: CreateBrandDto) {
        const result = await this.brandService.create(body);

        if (result.severity === "ERROR") {
            // throw new BadRequestException(result.detail);
            return new ResponseBuilder()
                .withCode(ResponseCodeEnum.BAD_REQUEST)
                .withMessage(result.detail)
                .build();
        }

        // return {
        //     statusCode: HttpStatus.CREATED,
        //     message: "Create successful brand",
        //     data: result
        // }
        return new ResponseBuilder()
            .withCode(ResponseCodeEnum.CREATED)
            .withMessage("Create successful brand")
            .withData(result)
            .build();
    }

    @Delete(":id")
    async delete(@Param("id", ParseIntPipe) id: number) {
        const result = await this.brandService.delete(id);

        if (result.severity === "ERROR") {
            // throw new BadRequestException(result.detail);
            return new ResponseBuilder()
                .withCode(ResponseCodeEnum.BAD_REQUEST)
                .withMessage(result.detail)
                .build();
        }

        if (result.affected === 1) {
            // return {
            //     statusCode: HttpStatus.OK,
            //     message: "Delete successful brand",
            // }
            return new ResponseBuilder()
                .withCode(ResponseCodeEnum.SUCCESS)
                .withMessage("Delete successful brand")
                .build();
        }
    }

    @Put("update")
    async update(@Body() body: UpdateBrandDto) {
        const data = { ...body, category: body.category_id };
        delete data.category_id;

        const result = await this.brandService.update(data);

        // return {
        //     statusCode: HttpStatus.OK,
        //     message: "Update successful category",
        //     data: result
        // }
        return new ResponseBuilder()
            .withCode(ResponseCodeEnum.SUCCESS)
            .withMessage("Update successful category")
            .withData(result)
            .build();
    }
}
