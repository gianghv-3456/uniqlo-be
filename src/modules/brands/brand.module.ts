import { Module } from "@nestjs/common"
import { BrandController } from "./brand.controller"
import { BrandService } from "./brand.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { JwtModule } from "@nestjs/jwt"
import { JWT_CONFIG } from "src/common/constants/jwt.constant"
import { Brand } from "./entity/brand.entity"
import { BrandControllerV2 } from "./brand.controller.v2"

@Module({
  imports: [
    TypeOrmModule.forFeature([Brand]),
    JwtModule.register({
      secret: JWT_CONFIG.ACCESS_KEY,
      signOptions: { expiresIn: JWT_CONFIG.ACCESS_TIME },
    }),
  ],
  controllers: [BrandController, BrandControllerV2],
  providers: [BrandService],
})
export class BrandModule {}
