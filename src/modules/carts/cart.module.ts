import { Module } from "@nestjs/common"
import { CartController } from "./cart.controller"
import { CartService } from "./cart.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { JwtModule } from "@nestjs/jwt"
import { JWT_CONFIG } from "src/common/constants/jwt.constant"
import { Cart } from "./entity/cart.entity"
import { Variation } from "../variations/entity/variation.entity"
import { CartControllerV2 } from "./cart.controller.v2"

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, Variation]),
    JwtModule.register({
      secret: JWT_CONFIG.ACCESS_KEY,
      signOptions: { expiresIn: JWT_CONFIG.ACCESS_TIME },
    }),
  ],
  controllers: [CartController, CartControllerV2],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
