import { Injectable, NotFoundException } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { CreateCartDto } from "./dto/create-cart.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Cart } from "./entity/cart.entity";
import { Variation } from "../variations/entity/variation.entity";
import { UpdateQuantityDto } from "./dto/update-quantity.dto";

@Injectable()
export class CartService {

    constructor(
        @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
        @InjectRepository(Variation) private readonly variationRepositoty: Repository<Variation>,
        private readonly dataSource: DataSource
    ) { };


    async getCartById(id: number) {
        return await this.cartRepository.find({ where: { account: { id: id } } })
    }

    async getProductByVariationId(id: number) {
        return await this.variationRepositoty.findOne({ where: { id: id }, relations: ['product'] })
    }

    async findByInfo(data: any) {

        const { account_id, variation_id } = data

        return await this.cartRepository.findOne({ where: { account: { id: account_id }, variationId: variation_id } });
    }

    async create(cart: CreateCartDto) {
        const { account_id, quantity, variation_id } = cart;

        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const result = await queryRunner.manager.query(`INSERT INTO carts (account_id, quantity, variation_id) 
            VALUES($1, $2, $3) RETURNING *;`, [account_id, quantity, variation_id]);
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
        return await this.cartRepository.delete(id);
    }

    async updateQuantity(data: UpdateQuantityDto) {
        const { status, id } = data;

        const cart = await this.cartRepository.findOne({ where: { id: id } });

        if (!cart) {
            throw new NotFoundException(`Cart with ID ${id} not found`);
        }

        cart.quantity = cart.quantity + status;

        return await this.cartRepository.save(cart);
    }

    async deleteCartByAccountId(id: number) {
        return await this.dataSource
            .createQueryBuilder()
            .delete()
            .from(Cart)
            .where("account = :account", { account: id })
            .execute()
    }
}