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
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { ResponseBuilder } from "src/utils/response-builder";
import { ResponseCodeEnum } from "src/common/constants/response-code.enum";

@Controller("categories")
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Get()
    async getCategories() {
        const result = await this.categoryService.getCategories();

        result.sort((a, b) => a.id - b.id);

        // return {
        //     statusCode: HttpStatus.OK,
        //     message: "Get successful category",
        //     data: result
        // }
        return new ResponseBuilder()
            .withCode(ResponseCodeEnum.SUCCESS)
            .withMessage("Get successful category")
            .build();
    }

    @Post("/create")
    async create(@Body() body: CreateCategoryDto) {
        const result = await this.categoryService.create(body);

        if (result.severity === "ERROR") {
            // throw new BadRequestException(result.detail);
            return new ResponseBuilder()
                .withCode(ResponseCodeEnum.BAD_REQUEST)
                .withMessage(result.detail)
                .build();
        }

        // return {
        //     statusCode: HttpStatus.CREATED,
        //     message: "Create successful category",
        //     data: result,
        // };
        return new ResponseBuilder()
            .withCode(ResponseCodeEnum.CREATED)
            .withMessage("Create successful category")
            .withData(result)
            .build();
    }

    @Delete(":id")
    async delete(@Param("id", ParseIntPipe) id: number) {
        const result = await this.categoryService.delete(id);

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
            //     message: "Delete successful category",
            // };
            return new ResponseBuilder()
                .withCode(ResponseCodeEnum.SUCCESS)
                .withMessage("Delete successful category")
                .build();
        }
    }

    @Put("update")
    async update(@Body() body: UpdateCategoryDto) {
        const result = await this.categoryService.update(body);

        // return {
        //     statusCode: HttpStatus.OK,
        //     message: "Update successful category",
        //     data: result,
        // };
        return new ResponseBuilder()
            .withCode(ResponseCodeEnum.SUCCESS)
            .withMessage("Update successful category")
            .withData(result)
            .build();
    }
}
