import { Account } from "src/modules/accounts/entity/account.entity";
import { Brand } from "src/modules/brands/entity/brand.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'carts' })
export class Cart {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "int", name: "variation_id" })
    variationId: number;

    @Column({ type: "int" })
    quantity: number;

    @ManyToOne(() => Account, account => account.carts)
    @JoinColumn({ name: 'account_id' })
    account: Account;
}