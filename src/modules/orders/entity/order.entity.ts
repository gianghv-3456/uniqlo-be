import { Account } from "src/modules/accounts/entity/account.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderDetail } from "./order-detail.entity";

@Entity({ name: 'orders' })
export class Order {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Account, account => account.orders)
    @JoinColumn({ name: 'account_id' })
    account: Account;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false, length: 10 })
    phone: string;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: false })
    address: string;

    @Column({ nullable: true })
    note: string;

    @Column({ type: 'decimal', precision: 12, scale: 2, nullable: false })
    total: number;

    @Column({ type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
    date: Date;

    @Column({ type: 'boolean', nullable: false, default: false })
    pay: boolean;

    @Column({ nullable: false, type: "enum", enum: ['pending', 'accept', 'user_deny', 'admin_deny'], default: 'pending' })
    status: string;

    @OneToMany(() => OrderDetail, orderDetail => orderDetail.order)
    details: OrderDetail[];
}