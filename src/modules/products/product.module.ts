import { Module } from "@nestjs/common";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./entity/product.entity";
import { JwtModule } from "@nestjs/jwt";
import { JWT_CONFIG } from "src/common/constants/jwt.constant";
import { Image } from "../images/entity/image.entity";
import { Variation } from "../variations/entity/variation.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Product, Image, Variation]),
        JwtModule.register({
            secret: JWT_CONFIG.ACCESS_KEY,
            signOptions: { expiresIn: JWT_CONFIG.ACCESS_TIME }
        }),
    ],
    controllers: [ProductController],
    providers: [ProductService]
})
export class ProductModule { }