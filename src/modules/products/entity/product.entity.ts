import { Wishlist } from "src/modules/accounts/entity/wishlist.entity";
import { Brand } from "src/modules/brands/entity/brand.entity";
import { Category } from "src/modules/categories/entity/category.entity";
import { Rating } from "src/modules/evaluations/entity/rate.entity";
import { Review } from "src/modules/evaluations/entity/reviews.entity";
import { Image } from "src/modules/images/entity/image.entity";
import { Variation } from "src/modules/variations/entity/variation.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'products' })
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50, unique: true, nullable: false })
    name: string;

    @Column({ type: 'decimal', precision: 12, scale: 2, nullable: false })
    price: number;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ name: 'specifications', type: 'text', nullable: false })
    specifications: string;

    @Column({ name: 'default_image', type: 'text', nullable: false })
    defaultImage: string;

    @Column({ name: 'average_rating', type: 'decimal', precision: 3, scale: 1, nullable: false, default: 0 })
    averageRating: number;

    @Column({ name: 'number_rating', nullable: false, default: 0 })
    numberRating: number;

    @Column({ name: 'discount_percentage', type: 'int', nullable: false, default: 0 })
    discountPercentage: number;

    @Column({ nullable: false, default: true })
    active: boolean;

    @Column({ name: 'created_at', type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @ManyToOne(() => Brand, brand => brand.products)
    @JoinColumn({ name: 'brand_id' })
    brand: Brand;

    @OneToMany(() => Variation, variation => variation.product)
    variations: Variation[];

    @OneToMany(() => Image, image => image.product)
    images: Image[];

    @OneToMany(() => Rating, rating => rating.product)
    ratings: Rating[];

    @OneToMany(() => Review, review => review.product)
    reviews: Review[];

    @OneToMany(() => Wishlist, wishlist => wishlist.product)
    wishlists: Wishlist[];

    //
    @ManyToOne(() => Category, category => category.products)
    @JoinColumn({ name: 'category_id' })
    category: Category;
}