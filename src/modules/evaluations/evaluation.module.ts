import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JWT_CONFIG } from "src/common/constants/jwt.constant";
import { EvaluationController } from "./evaluation.controller";
import { EvaluationService } from "./evaluation.service";
import { Rating } from "./entity/rate.entity";
import { Review } from "./entity/reviews.entity";
import { Product } from "../products/entity/product.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Rating, Review, Product]),
        JwtModule.register({
            secret: JWT_CONFIG.ACCESS_KEY,
            signOptions: { expiresIn: JWT_CONFIG.ACCESS_TIME }
        }),
    ],
    controllers: [EvaluationController],
    providers: [EvaluationService]
})
export class EvaluationModule { }