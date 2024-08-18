import { Account } from "src/modules/accounts/entity/account.entity";
import { Product } from "src/modules/products/entity/product.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'reviews' })
export class Review {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    content: string;

    @Column({ name: 'created_at', type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @ManyToOne(() => Account, account => account.reviews)
    @JoinColumn({ name: 'account_id' })
    account: Account;

    @ManyToOne(() => Product, product => product.reviews)
    @JoinColumn({ name: 'product_id' })
    product: Product;
}