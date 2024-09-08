import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Collection } from "./entity/conllection.entity";
import { Repository } from "typeorm";
import { Product } from "../products/entity/product.entity";
import { CreateCollectionDto } from "./dto/create-collection.dto";
import { ProductService } from "../products/product.service";
import { ResponseBuilder } from "src/utils/response-builder";
import { ResponseCodeEnum } from "src/common/constants/response-code.enum";
import { UpdateCollectionDto } from "./dto/update-collection.dto";

@Injectable()
export class CollectionService {
    constructor(
        @InjectRepository(Collection)
        private readonly collectionRepository: Repository<Collection>,
        private readonly productService: ProductService
    ) {}

    async getAll() {
        const listCollection = await this.collectionRepository.find({
            relations: ["products"],
        });
        listCollection.sort((a, b) => a.id - b.id);

        return new ResponseBuilder()
            .withCode(ResponseCodeEnum.SUCCESS)
            .withMessage("Get successful collections")
            .withData(listCollection)
            .build();
    }

    async getRandom(): Promise<any> {
        try {
            const listCollection = await this.collectionRepository.find({
                relations: ["products"],
            });

            if (listCollection.length === 0) {
                return new ResponseBuilder()
                    .withCode(ResponseCodeEnum.NOT_FOUND)
                    .withMessage("No collections found")
                    .build();
            }

            const total = listCollection.length;
            const randomIndex = Math.floor(Math.random() * total);

            const randomCollection = listCollection[randomIndex];

            return new ResponseBuilder()
                .withCode(ResponseCodeEnum.SUCCESS)
                .withMessage("Get successful collections")
                .withData(randomCollection)
                .build();
        } catch (error) {
            return new ResponseBuilder()
                .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
                .withMessage("Internal server error!")
                .build();
        }
    }

    async findById(id: number): Promise<any> {
        try {
            const existCollection = await this.collectionRepository.findOne({
                where: {
                    id: id,
                },
                relations: ["products"],
            });
            if (!existCollection) {
                return new ResponseBuilder()
                    .withCode(ResponseCodeEnum.NOT_FOUND)
                    .withMessage("Collection not exist!")
                    .build();
            }

            return new ResponseBuilder()
                .withCode(ResponseCodeEnum.SUCCESS)
                .withMessage("Find collection successfully!")
                .withData(existCollection)
                .build();
        } catch (error) {
            return new ResponseBuilder()
                .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
                .withMessage("Internal server error!")
                .build();
        }
    }

    async create(createCollectionDto: CreateCollectionDto): Promise<any> {
        try {
            const products = await this.productService.findByIds(
                createCollectionDto.productIds
            );

            const newCollection = this.collectionRepository.create({
                title: createCollectionDto.title,
                description: createCollectionDto.description,
                products: products,
            });

            await this.collectionRepository.save(newCollection);

            return new ResponseBuilder()
                .withCode(ResponseCodeEnum.CREATED)
                .withMessage("Create collection successfully!")
                .withData(newCollection)
                .build();
        } catch (error) {
            return new ResponseBuilder()
                .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
                .withMessage("Internal server error!")
                .build();
        }
    }

    async updateById(
        id: number,
        updateCollectionDto: UpdateCollectionDto
    ): Promise<any> {
        try {
            const { productIds, title, description } = updateCollectionDto;

            const existCollection = await this.collectionRepository.findOne({
                where: {
                    id: id,
                },
                relations: ["products"],
            });
            if (!existCollection) {
                return new ResponseBuilder()
                    .withCode(ResponseCodeEnum.NOT_FOUND)
                    .withMessage("Collection not exist!")
                    .build();
            }

            // let products = []
            const products = await this.productService.findByIds(productIds);

            existCollection.title = title;
            existCollection.description = description;
            existCollection.products = products;

            const collectionUpdated =
                await this.collectionRepository.save(existCollection);

            return new ResponseBuilder()
                .withCode(ResponseCodeEnum.SUCCESS)
                .withMessage("Update collection successfully!")
                .withData(collectionUpdated)
                .build();
        } catch (error) {
            return new ResponseBuilder()
                .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
                .withMessage("Internal server error")
                .build();
        }
    }

    async deleteById(id: number) {
        try {
            const existCollection = await this.collectionRepository.findOne({
                where: {
                    id: id,
                },
                relations: ["products"],
            });

            if (!existCollection) {
                return new ResponseBuilder()
                    .withCode(ResponseCodeEnum.NOT_FOUND)
                    .withMessage("Collection not exist!")
                    .build();
            }
            await this.collectionRepository.remove(existCollection);

            return new ResponseBuilder()
                .withCode(ResponseCodeEnum.SUCCESS)
                .withMessage("Delete collection successfully!")
                .build();
        } catch (error) {
            return new ResponseBuilder()
                .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
                .withMessage("Internal server error")
                .build();
        }
    }
}
