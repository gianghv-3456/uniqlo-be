import { Account } from "src/modules/accounts/entity/account.entity";
import { Product } from "src/modules/products/entity/product.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'ratings' })
export class Rating {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int', })
    star: number;


    @ManyToOne(() => Account, account => account.ratings)
    @JoinColumn({ name: 'account_id' })
    account: Account;

    @ManyToOne(() => Product, product => product.ratings)
    @JoinColumn({ name: 'product_id' })
    product: Product;
}