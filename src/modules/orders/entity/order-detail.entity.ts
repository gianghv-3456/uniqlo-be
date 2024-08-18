import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity({ name: 'order_details' })
export class OrderDetail {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    variation: string;

    @Column({ nullable: false })
    quantity: number;

    @ManyToOne(() => Order, order => order.details)
    @JoinColumn({ name: 'order_id' })
    order: Order;
}