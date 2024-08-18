import { Cart } from "src/modules/carts/entity/cart.entity";
import { Rating } from "src/modules/evaluations/entity/rate.entity";
import { Review } from "src/modules/evaluations/entity/reviews.entity";
import { Order } from "src/modules/orders/entity/order.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Wishlist } from "./wishlist.entity";

@Entity({ name: 'accounts' })
export class Account {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50, nullable: false })
    name: string;

    @Column({ length: 50, unique: true, nullable: false })
    email: string;

    @Column({ length: 255, nullable: false })
    password: string;

    @Column({ length: 10, unique: false, nullable: true })
    phone: string;

    @Column({ nullable: true, name: 'image_path' })
    imagePath: string;

    @Column({ type: 'enum', enum: ['male', 'female', 'other'], default: 'other' })
    gender: string;

    @Column({ type: 'enum', enum: ['user', 'admin'], default: 'user' })
    role: string;

    @Column({ nullable: false, default: true })
    active: boolean;

    @Column({ name: "password_reset", nullable: true })
    passwordReset: string;

    @Column({ nullable: true })
    birthday: string;

    // // mối quan hệ giữa bảng accounts với bảng orders (2)
    @OneToMany(() => Order, order => order.account)
    orders: Order[];

    @OneToMany(() => Cart, cart => cart.account)
    carts: Cart[];

    @OneToMany(() => Rating, rating => rating.account)
    ratings: Rating[];

    @OneToMany(() => Review, review => review.account)
    reviews: Rating[];

    @OneToMany(() => Wishlist, wishlist => wishlist.account)
    wishlists: Wishlist[];
}