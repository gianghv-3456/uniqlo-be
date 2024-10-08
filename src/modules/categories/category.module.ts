import { Module } from "@nestjs/common"
import { CategoryController } from "./category.controller"
import { CategoryControllerV2 } from "./category.controller.v2"
import { CategoryService } from "./category.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Category } from "./entity/category.entity"
import { JwtModule } from "@nestjs/jwt"
import { JWT_CONFIG } from "src/common/constants/jwt.constant"
import { Brand } from "../brands/entity/brand.entity"

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Brand]),
    JwtModule.register({
      secret: JWT_CONFIG.ACCESS_KEY,
      signOptions: { expiresIn: JWT_CONFIG.ACCESS_TIME },
    }),
  ],
  controllers: [CategoryController, CategoryControllerV2],
  providers: [CategoryService],
})
export class CategoryModule {}
