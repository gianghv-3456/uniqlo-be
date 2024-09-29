import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common"
import { CollectionService } from "./collection.service"
import { CreateCollectionDto } from "./dto/create-collection.dto"
import { UpdateCollectionDto } from "./dto/update-collection.dto"
import { ResponseBuilder2 } from "src/utils/response-builder-v2"
import { ResponseCodeEnum } from "src/common/constants/response-code.enum"

@Controller("v2/collections")
export class CollectionControllerV2 {
  constructor(private readonly collectionService: CollectionService) {}

  @Get()
  async getAll() {
    let allCollections = await this.collectionService.getAll()
    return new ResponseBuilder2()
      .withCode(ResponseCodeEnum.NOT_FOUND)
      .withMessage("Successfully get all collections")
      .withData(allCollections)
      .build()
  }

  @Get("random")
  async getRandom(): Promise<any> {
    let allCollections = await this.collectionService.getRandom()
    return new ResponseBuilder2()
      .withCode(ResponseCodeEnum.NOT_FOUND)
      .withMessage("Successfully get random collections")
      .withData(allCollections)
      .build()
  }

  @Get(":id")
  async findById(@Param("id") id: number) {
    let result = await this.collectionService.findById(id)

    if (!result) {
      return new ResponseBuilder2()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage("Collection not found")
        .build()
    }

    return new ResponseBuilder2()
      .withCode(ResponseCodeEnum.NOT_FOUND)
      .withMessage(" Successfully get collection by id")
      .withData(result)
      .build()
  }

  @Post("create")
  async create(@Body() body: CreateCollectionDto): Promise<any> {
    return await this.collectionService.create(body)
  }

  @Put(":id")
  async updateById(@Param("id") id: number, @Body() body: UpdateCollectionDto) {
    return await this.collectionService.updateById(id, body)
  }

  @Delete(":id")
  async deleteById(@Param("id") id: number) {
    return await this.collectionService.deleteById(id)
  }
}
