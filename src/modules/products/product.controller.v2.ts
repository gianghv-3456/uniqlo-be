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
  Query,
} from "@nestjs/common"
import { ProductService } from "./product.service"
import { CreateProductDto } from "./dto/create-product.dto"
import { UpadteImageDto } from "./dto/update-image.dto"
import { ResponseBuilder2 } from "src/utils/response-builder-v2"
import { ResponseCodeEnum } from "src/common/constants/response-code.enum"

@Controller("v2/products")
export class ProductControllerV2 {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAll() {
    const result = await this.productService._getAll()
    result.sort((a, b) => a.id - b.id)
    // return {
    //     statusCode: HttpStatus.OK,
    //     message: "Get successful product",
    //     data: result
    // }
    return new ResponseBuilder2()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage("Get successful product")
      .withData(result)
      .build()
  }

  @Get("/v2")
  async getAllV2(@Query() query) {
    const { limit, page } = query
    const [result, total] = await this.productService.getAllV2(limit, page)
    result.sort((a, b) => a.id - b.id)
    // return {
    //     statusCode: HttpStatus.OK,
    //     message: "Get successful product",
    //     data: result
    // }
    return new ResponseBuilder2()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage("Get successful product")
      .withData({
        items: result,
        meta: {
          total: total,
          page: page,
        },
      })
      .build()
  }

  @Get(":id")
  async getById(@Param("id", ParseIntPipe) id: number) {
    const result = await this.productService.getById(id)

    // return {
    //     statusCode: HttpStatus.OK,
    //     message: "Get successful product",
    //     data: result
    // }
    return new ResponseBuilder2()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage("Get successful product")
      .withData(result)
      .build()
  }

  @Post("create")
  async create(@Body() body: CreateProductDto) {
    const result = await this.productService.create(body)

    if (result?.severity === "ERROR") {
      // throw new BadRequestException(result.detail);
      return new ResponseBuilder2()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(result.detail)
        .build()
    }

    const { images } = body
    const productImages = images.filter((image) => image !== "")

    if (productImages.length > 0) {
      try {
        await this.productService.createImages(result[0], productImages)
      } catch (error) {
        console.log(error)
      }
    }

    // return {
    //     statusCode: HttpStatus.CREATED,
    //     message: "Create successful product",
    //     data: result
    // }
    return new ResponseBuilder2()
      .withCode(ResponseCodeEnum.CREATED)
      .withMessage("Create successful product")
      .withData(result)
      .build()
  }

  @Delete(":id")
  async delete(@Param("id", ParseIntPipe) id: number) {
    // const resultDeleteImages = await this.productService.deleteImages(id);

    const result = await this.productService.delete(id)

    // return {
    //     statusCode: HttpStatus.OK,
    //     message: "Delete successful product",
    //     data: result,
    // };
    return new ResponseBuilder2()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage("Delete successful product")
      .build()
  }

  @Put("update-image")
  async updateImage(@Body() body: UpadteImageDto) {
    const result = await this.productService.updateImage(body)

    if (result?.severity === "ERROR") {
      // throw new BadRequestException(result.detail);
      return new ResponseBuilder2()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(result.detail)
        .build()
    }

    // return {
    //     statusCode: HttpStatus.OK,
    //     message: "Update successful image",
    // };
    return new ResponseBuilder2()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage("Update successful image")
      .build()
  }

  @Put("update")
  async update(@Body() body: any) {
    body.discountPercentage = body.discount_percentage
    delete body.discount_percentage

    const result = await this.productService.update(body)

    if (result?.severity === "ERROR") {
      // throw new BadRequestException(result.detail);
      return new ResponseBuilder2()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(result.detail)
        .build()
    }

    // return {
    //     statusCode: HttpStatus.OK,
    //     message: "Update successful product",
    //     data: "oke",
    // };
    return new ResponseBuilder2()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage("Update successful product")
      .build()
  }

  @Get("urecommend/:id")
  async getRecommendProduct(@Param("id", ParseIntPipe) id: number) {
    const result = await this.productService.getUserRecommendation(id)

    if (!result) {
      const emptyData = []
      return new ResponseBuilder2()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage("Get successful product")
        .withData(emptyData)
        .build()
    }

    return new ResponseBuilder2()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage("Get successful product")
      .withData(result)
      .build()
  }

  @Get("precommend/:id")
  async getProductRecommend(@Param("id", ParseIntPipe) id: number) {
    const result = await this.productService.getProductRecommendation(id)

    if (!result) {
      const emptyData = []
      return new ResponseBuilder2()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage("Get successful product")
        .withData(emptyData)
        .build()
    }

    return new ResponseBuilder2()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage("Get successful product")
      .withData(result)
      .build()
  }
}
