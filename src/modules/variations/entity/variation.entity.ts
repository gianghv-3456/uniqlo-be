import { Product } from "src/modules/products/entity/product.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'variations' })
export class Variation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    color: string;

    @Column({ type: 'decimal', precision: 12, scale: 2, nullable: false })
    price: number;

    @Column({ name: 'stock', type: 'int', nullable: false, default: 0 })
    stock: number;

    @Column({ name: 'sold', type: 'int', nullable: false, default: 0 })
    sold: number;

    @Column({ nullable: false })
    image: string;

    @ManyToOne(() => Product, product => product.variations)
    @JoinColumn({ name: 'product_id' })
    product: Product;
}