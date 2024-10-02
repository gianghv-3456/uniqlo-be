import { Injectable } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { Brand } from "./entity/brand.entity";
import { DataSource, EntityManager, In, Repository } from "typeorm";
import { CreateBrandDto } from "./dto/create-brand.dto";
import { UpdateBrandDto } from "./dto/update-brand.dto";
import { Category } from "../categories/entity/category.entity";

@Injectable()
export class BrandService {
    constructor(
        @InjectRepository(Brand)
        private readonly brandRepository: Repository<Brand>,
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
        @InjectEntityManager() private readonly entityManager: EntityManager,
        private readonly dataSource: DataSource
    ) {}

    async getAll() {
        return await this.brandRepository.find({ relations: ["categories"] });
    }

    async getAllV2(limit, page) {
        const skip = (page - 1) * limit;
        return await this.brandRepository.findAndCount({
            relations: ["categories"],
            skip: skip,
            take: limit,
        });
    }

    async create(brandDto: CreateBrandDto) {
        const { name, logo, category_ids } = brandDto;

        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Find categories by their IDs
            const categories = await queryRunner.manager.findByIds(
                Category,
                category_ids
            );

            if (categories.length !== category_ids.length) {
                throw new Error("One or more categories not found.");
            }

            // Create the new brand instance
            const newBrand = new Brand();
            newBrand.name = name;
            newBrand.logo = logo;
            newBrand.categories = categories;

            // Save the brand with its associated categories
            const savedBrand = await queryRunner.manager.save(Brand, newBrand);

            await queryRunner.commitTransaction();
            return savedBrand;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            console.log(err.message);
            return err;
        } finally {
            await queryRunner.release();
        }
    }

    async delete(id: number) {
        try {
            return await this.brandRepository.delete(id);
        } catch (error) {
            return error;
        }
    }

    async update(updateBrandDto: UpdateBrandDto) {
        const { id, category_ids, ...brandData } = updateBrandDto;

        try {
            // Find the brand by ID
            const brand = await this.brandRepository.findOne({
                where: { id },
                relations: ["categories"],
            });

            if (!brand) {
                throw new Error("Brand not found");
            }

            // Find categories by their IDs using the In() operator
            const categories = await this.categoryRepository.find({
                where: { id: In(category_ids) },
            });

            if (categories.length !== category_ids.length) {
                throw new Error("One or more categories not found.");
            }

            // Update brand fields
            Object.assign(brand, brandData);

            // Update the categories association
            brand.categories = categories;

            // Save the updated brand entity
            return await this.brandRepository.save(brand);
        } catch (error) {
            console.log(error);
            return error;
        }
    }
}
