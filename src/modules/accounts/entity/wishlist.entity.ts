import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Account } from "./account.entity";
import { Product } from "src/modules/products/entity/product.entity";

@Entity({ name: 'wishlists' })
export class Wishlist {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Account, account => account.wishlists)
    @JoinColumn({ name: 'account_id' })
    account: Account;

    @ManyToOne(() => Product, product => product.wishlists)
    @JoinColumn({ name: 'product_id' })
    product: Product;
}
