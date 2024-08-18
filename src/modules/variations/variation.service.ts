import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Variation } from "./entity/variation.entity";
import { DataSource, Repository } from "typeorm";
import { CreateVariationDto } from "./dto/create-variation.dto";

@Injectable()
export class VariationService {

    constructor(
        @InjectRepository(Variation) private readonly variationRepository: Repository<Variation>,
        private readonly dataSource: DataSource
    ) { };

    async getAll() {
        return await this.variationRepository.find();
    }

    async getByProductId(id: number) {
        return await this.variationRepository.find({ where: { product: { id: id } } })
    }

    async create(variation: CreateVariationDto) {
        const { color, price, image, product_id, stock } = variation;

        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const result = await queryRunner.manager.query(`INSERT INTO variations (color, price, image, product_id, stock) 
            VALUES($1, $2, $3, $4, $5) RETURNING *;`, [color, price, image, product_id, stock]);
            await queryRunner.commitTransaction();
            return result;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            console.log(err);
            return err;
        } finally {
            await queryRunner.release();
        }
    }

    async delete(id: number) {
        try {
            return await this.variationRepository.delete(id);
        } catch (error) {
            return error;
        }
    }

    async update(variation: any) {
        const { id, color, price, stock, image } = variation;

        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const result = await queryRunner.manager.query(
                `UPDATE variations SET color=$1, price=$2, stock=$3, image=$4 WHERE id=$5  RETURNING *;`,
                [color, price, stock, image, id]);
            await queryRunner.commitTransaction();
            return result;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            console.log(err);
            return err;
        } finally {
            await queryRunner.release();
        }
    }

    async getProductById(id: number) {
        return this.variationRepository.findOne({ where: { id: id }, relations: ['product'] })
    }

    async checkListQuantity(data: any) {
        const message = [];
        const promises = data.map(async (item: any) => {
            const variation = await this.variationRepository.findOne({ where: { id: item.variationId }, relations: ['product'] });
            if (!variation || variation.stock < item.quantity) {
                message.push(`${variation.product.name}:${item.quantity - variation.stock}`);
                return false;
            }
        });

        await Promise.all(promises);

        if (message.length === 0) {
            return message;
        } else {
            return message;
        }
    }

    async minusQuantity(data: any) {

        const promises = data.map(async (item: any) => {
            const variation = await this.variationRepository.findOne({ where: { id: item.variationId } });

            variation.stock -= item.quantity;
            await this.variationRepository.save(variation);
            return true;
        });

        const results = await Promise.all(promises);

        return !results.includes(false);

    }
}