import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { TypeOrmModule } from "@nestjs/typeorm"
import { JWT_CONFIG } from "src/common/constants/jwt.constant"
import { CollectionController } from "./collection.controller"
import { CollectionControllerV2 } from "./collection.controller.v2"
import { CollectionService } from "./collection.service"
import { CollectionService2 } from "./collection.service.v2"
import { Collection } from "./entity/conllection.entity"
import { ProductService } from "../products/product.service"
import { ProductModule } from "../products/product.module"
import { Product } from "../products/entity/product.entity"
import { Image } from "../images/entity/image.entity"
import { Variation } from "../variations/entity/variation.entity"

@Module({
  imports: [
    TypeOrmModule.forFeature([Collection, Product, Image, Variation]),
    JwtModule.register({
      secret: JWT_CONFIG.ACCESS_KEY,
      signOptions: { expiresIn: JWT_CONFIG.ACCESS_TIME },
    }),
  ],
  controllers: [CollectionController, CollectionControllerV2],
  providers: [CollectionService, CollectionService2, ProductService],
})
export class CollectionModule {}
