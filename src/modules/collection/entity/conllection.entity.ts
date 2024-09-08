import { Product } from "src/modules/products/entity/product.entity";
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity({ name: "collections" })
export class Collection {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @ManyToMany(() => Product, (product) => product.collections)
    @JoinTable({
        name: "collection_products",
        joinColumn: {
            name: "collection_id",
            referencedColumnName: "id",
        },
        inverseJoinColumn: {
            name: "product_id",
            referencedColumnName: "id",
        },
    })
    products: Product[];

    @CreateDateColumn({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP(6)",
    })
    public createdAt: Date;

    @UpdateDateColumn({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP(6)",
        onUpdate: "CURRENT_TIMESTAMP(6)",
    })
    public updatedAt: Date;
}
