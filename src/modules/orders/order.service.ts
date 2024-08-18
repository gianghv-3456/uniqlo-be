import { Injectable } from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Order } from "./entity/order.entity";
import { DataSource, Repository } from "typeorm";
import { OrderDetail } from "./entity/order-detail.entity";
import { ChangeStatusDto } from "./dto/change-status.dto";

@Injectable()
export class OrderService {

    constructor(
        @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
        @InjectRepository(OrderDetail) private readonly orderDetailRepository: Repository<OrderDetail>,
        private readonly dataSource: DataSource
    ) { };

    async getOrders() {
        return await this.orderRepository.find({ relations: ['details'] });
    }

    async getOrderByAccount(id: number) {
        return await this.orderRepository.find({ where: { account: { id: id } }, relations: ['details'] });
    }

    async getOrderDetailsByOrderId(id: number) {
        return await this.orderDetailRepository.find({ where: { order: { id: id } } });
    }

    async createOrder(data: CreateOrderDto) {
        const { name, address, phone, email, note, total, pay, account_id } = data;

        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const result = await queryRunner.manager.query(`INSERT INTO orders (name, address, phone, email, note, total, pay, account_id) 
            VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;`, [name, address, phone, email, note, total, pay, account_id]);
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

    async createOrderDetail(data: any) {
        return await this.orderDetailRepository.save(data);
    }

    async changeStatus(data: ChangeStatusDto) {
        const { id, status } = data;

        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            let result = null;
            if (status === 'accept') {
                result = await queryRunner.manager.query(
                    `UPDATE orders SET status=$1, pay=$2 WHERE id=$3  RETURNING *;`,
                    [status, true, id]);
            } else {
                result = await queryRunner.manager.query(
                    `UPDATE orders SET status=$1 WHERE id=$2  RETURNING *;`,
                    [status, id]);
            }

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
}