import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common"
import { CollectionService2 } from "./collection.service.v2"
import { CreateCollectionDto } from "./dto/create-collection.dto"
import { UpdateCollectionDto } from "./dto/update-collection.dto"
import { ResponseCodeEnum } from "src/common/constants/response-code.enum"

@Controller("v2/collections")
export class CollectionControllerV2 {
  constructor(private readonly collectionService: CollectionService2) {}

  @Get()
  async getAll() {
    let allCollections = await this.collectionService.getAll()
    return allCollections
  }

  @Get("random")
  async getRandom(): Promise<any> {
    return await this.collectionService.getRandom()
  }

  @Get(":id")
  async findById(@Param("id") id: number) {
    return await this.collectionService.findById(id)
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
