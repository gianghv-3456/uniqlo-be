import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    Put,
} from "@nestjs/common";
import { CreateEvaluationDto } from "./dto/CreateEvaluation.dto";
import { EvaluationService } from "./evaluation.service";
import { ResponseBuilder } from "src/utils/response-builder";
import { ResponseCodeEnum } from "src/common/constants/response-code.enum";

@Controller("evaluations")
export class EvaluationController {
    constructor(private readonly evaluationService: EvaluationService) {}

    @Get("account/:id")
    async getRatingByAccount(@Param("id", ParseIntPipe) id: number) {
        const result = await this.evaluationService.getRatingByAccount(id);

        // return {
        //     statusCode: HttpStatus.OK,
        //     message: "Get successful evaluations",
        //     data: result
        // }
        return new ResponseBuilder()
            .withCode(ResponseCodeEnum.SUCCESS)
            .withMessage("Get successful evaluations")
            .withData(result)
            .build();
    }

    @Get("reviews/:id")
    async getProductReviews(@Param("id", ParseIntPipe) id: number) {
        const result = await this.evaluationService.getProductReviews(id);

        // return {
        //     statusCode: HttpStatus.OK,
        //     message: "Get successful review",
        //     data: result
        // }
        return new ResponseBuilder()
            .withCode(ResponseCodeEnum.SUCCESS)
            .withMessage("Get successful review")
            .withData(result)
            .build();
    }

    @Get("stars/:id")
    async getStarForProduct(@Param("id", ParseIntPipe) id: number) {
        const result = await this.evaluationService.getProductStar(id);

        // return {
        //     statusCode: HttpStatus.OK,
        //     message: "Get successful review",
        //     data: result
        // }
        return new ResponseBuilder()
            .withCode(ResponseCodeEnum.SUCCESS)
            .withMessage("Get successful review")
            .withData(result)
            .build();
    }

    @Post("create")
    async create(@Body() body: CreateEvaluationDto) {
        await this.evaluationService.createRating(body);

        await this.evaluationService.createReview(body);

        // return {
        //     statusCode: HttpStatus.CREATED,
        //     message: "Create evaluation success",
        //     data: body
        // }
        return new ResponseBuilder()
            .withCode(ResponseCodeEnum.CREATED)
            .withMessage("Create evaluation success")
            .withData(body)
            .build();
    }
}
