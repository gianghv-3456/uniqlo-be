import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
} from "@nestjs/common";
import { CollectionService } from "./collection.service";
import { CreateCollectionDto } from "./dto/create-collection.dto";
import { UpdateCollectionDto } from "./dto/update-collection.dto";

@Controller("collections")
export class CollectionController {
    constructor(private readonly collectionService: CollectionService) {}

    @Get()
    async getAll(): Promise<any> {
        return await this.collectionService.getAll();
    }

    @Get("random")
    async getRandom(): Promise<any> {
        return await this.collectionService.getRandom();
    }

    @Get(":id")
    async findById(@Param("id") id: number) {
        return await this.collectionService.findById(id);
    }

    @Post("create")
    async create(@Body() body: CreateCollectionDto): Promise<any> {
        return await this.collectionService.create(body);
    }

    @Put(":id")
    async updateById(
        @Param("id") id: number,
        @Body() body: UpdateCollectionDto
    ) {
        return await this.collectionService.updateById(id, body);
    }

    @Delete(":id")
    async deleteById(@Param("id") id: number) {
        return await this.collectionService.deleteById(id);
    }
}
