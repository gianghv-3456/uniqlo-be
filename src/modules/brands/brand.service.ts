import { Injectable } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { Brand } from "./entity/brand.entity";
import { DataSource, EntityManager, Repository } from "typeorm";
import { CreateBrandDto } from "./dto/create-brand.dto";
import { UpdateBrandDto } from "./dto/update-brand.dto";

@Injectable()
export class BrandService {

    constructor(
        @InjectRepository(Brand) private readonly brandRepository: Repository<Brand>,
        @InjectEntityManager() private readonly entityManager: EntityManager,
        private readonly dataSource: DataSource
    ) { };

    async getAll() {
        return await this.brandRepository.find({ relations: ['category'] });
    }

    async create(brand: CreateBrandDto) {
        const { name, logo, category_id } = brand;

        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const result = await queryRunner.manager.query(`INSERT INTO types (name, logo, category_id) 
            VALUES($1, $2, $3) RETURNING *;`, [name, logo, category_id]);
            await queryRunner.commitTransaction();
            return result;
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

    async update(brand: any) {
        const { id, ...data } = brand;
        try {
            return await this.brandRepository.update(id, data);
        } catch (error) {
            return error;
        }
    }
}