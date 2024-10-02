import { Category } from "src/modules/categories/entity/category.entity";
import { Product } from "src/modules/products/entity/product.entity";
import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "types" })
export class Brand {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50, nullable: false })
    name: string;

    @Column({ type: "text", nullable: false })
    logo: string;

    @Column({ nullable: false, default: true })
    active: boolean;

    @ManyToMany(() => Category, (category) => category.brands)
    @JoinTable({
        name: "brand_categories", // Name of the join table
        joinColumn: { name: "brand_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "category_id", referencedColumnName: "id" },
    })
    categories: Category[];

    @OneToMany(() => Product, (product) => product.brand)
    products: Product[];
}
