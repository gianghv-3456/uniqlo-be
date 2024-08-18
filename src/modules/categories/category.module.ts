import { Module } from "@nestjs/common";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Category } from "./entity/category.entity";
import { JwtModule } from "@nestjs/jwt";
import { JWT_CONFIG } from "src/common/constants/jwt.constant";

@Module({
    imports: [
        TypeOrmModule.forFeature([Category]),
        JwtModule.register({
            secret: JWT_CONFIG.ACCESS_KEY,
            signOptions: { expiresIn: JWT_CONFIG.ACCESS_TIME }
        }),
    ],
    controllers: [CategoryController],
    providers: [CategoryService]
})
export class CategoryModule { }