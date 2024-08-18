import { Module } from "@nestjs/common";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { JwtModule } from "@nestjs/jwt";
import { JWT_CONFIG } from "src/common/constants/jwt.constant";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "./entity/order.entity";
import { OrderDetail } from "./entity/order-detail.entity";
import { CartModule } from "../carts/cart.module";
import { VariationModule } from "../variations/variation.module";

@Module({
    imports: [
        CartModule,
        VariationModule,
        TypeOrmModule.forFeature([Order, OrderDetail]),
        JwtModule.register({
            secret: JWT_CONFIG.ACCESS_KEY,
            signOptions: { expiresIn: JWT_CONFIG.ACCESS_TIME }
        }),
    ],
    controllers: [OrderController],
    providers: [OrderService]
})
export class OrderModule { }