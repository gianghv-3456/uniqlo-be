import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "./entity/category.entity";
import { Repository } from "typeorm";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoryService {

    constructor(
        @InjectRepository(Category) private readonly categoryRepository: Repository<Category>
    ) { };

    async getCategories() {
        return await this.categoryRepository.find({ relations: ['brands'] });
    }

    async create(category: any) {
        try {
            const newCategory = this.categoryRepository.create(category);
            return await this.categoryRepository.save(newCategory);
        } catch (error) {
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

    async update(category: UpdateCategoryDto) {
        const { id, ...data } = category;
        try {
            await this.categoryRepository.update(id, data);
        } catch (error) {
            return error;
        }
    }
}