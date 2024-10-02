import { Brand } from "src/modules/brands/entity/brand.entity";
import { Product } from "src/modules/products/entity/product.entity";
import {
    Column,
    Entity,
    JoinColumn,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "categories" })
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50, unique: true, nullable: false })
    name: string;

    @Column({ nullable: false, default: true })
    active: boolean;

    @ManyToMany(() => Brand, (brand) => brand.categories)
    brands: Brand[];

    @OneToMany(() => Product, (product) => product.category)
    products: Brand[];
}
