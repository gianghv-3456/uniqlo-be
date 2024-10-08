import { Module } from "@nestjs/common"
import { VariationService } from "./variation.service"
import { VariationController } from "./variation.controller"
import { VariationControllerV2 } from "./variation.controller.v2"
import { TypeOrmModule } from "@nestjs/typeorm"
import { JwtModule } from "@nestjs/jwt"
import { JWT_CONFIG } from "src/common/constants/jwt.constant"
import { Variation } from "./entity/variation.entity"

@Module({
  imports: [
    TypeOrmModule.forFeature([Variation]),
    JwtModule.register({
      secret: JWT_CONFIG.ACCESS_KEY,
      signOptions: { expiresIn: JWT_CONFIG.ACCESS_TIME },
    }),
  ],
  controllers: [VariationController, VariationControllerV2],
  providers: [VariationService],
  exports: [VariationService],
})
export class VariationModule {}
