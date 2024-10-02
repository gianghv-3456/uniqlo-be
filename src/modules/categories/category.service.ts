import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "./entity/category.entity";
import { In, Repository } from "typeorm";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { Brand } from "../brands/entity/brand.entity";

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
        @InjectRepository(Brand)
        private readonly brandRepository: Repository<Brand>
    ) {}

    async getCategories() {
        return await this.categoryRepository.find({ relations: ["brands"] });
    }

    async create(createCategoryDto: CreateCategoryDto) {
        const { name, brand_ids } = createCategoryDto;

        try {
            // Find brands using the In() operator
            const brands = await this.brandRepository.find({
                where: { id: In(brand_ids) },
            });

            if (brands.length !== brand_ids.length) {
                throw new Error("One or more brands not found.");
            }

            // Create a new Category entity and associate the brands
            const newCategory = this.categoryRepository.create({
                name,
                brands,
            });

            // Save the category with its associated brands
            return await this.categoryRepository.save(newCategory);
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async delete(id: number) {
        try {
            return await this.categoryRepository.delete(id);
        } catch (error) {
            return error;
        }
    }

    async update(updateCategoryDto: UpdateCategoryDto) {
        const { id, name, active, brand_ids } = updateCategoryDto;

        try {
            // Find the category by ID
            const category = await this.categoryRepository.findOne({
                where: { id },
                relations: ["brands"],
            });

            if (!category) {
                throw new Error("Category not found.");
            }

            // Find brands using the In() operator
            const brands = await this.brandRepository.find({
                where: { id: In(brand_ids) },
            });

            if (brands.length !== brand_ids.length) {
                throw new Error("One or more brands not found.");
            }

            // Update category fields
            category.name = name;
            category.active = active;

            // Update the brands association
            category.brands = brands;

            // Save the updated category entity
            return await this.categoryRepository.save(category);
        } catch (error) {
            console.log(error);
            return error;
        }
    }
}
