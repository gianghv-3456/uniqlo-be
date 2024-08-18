import { Product } from "src/modules/products/entity/product.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'images' })
export class Image {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    image_path: string;

    @ManyToOne(() => Product, product => product.images)
    @JoinColumn({ name: 'product_id' })
    product?: Product;
}