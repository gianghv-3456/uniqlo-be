import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Account } from "./entity/account.entity"
import { AccountController } from "./account.controller"
import { AccountControllerV2 } from "./account.controller.v2"
import { AccountService } from "./account.service"
import { JwtModule } from "@nestjs/jwt"
import { JWT_CONFIG } from "src/common/constants/jwt.constant"
import { Wishlist } from "./entity/wishlist.entity"

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, Wishlist]),
    JwtModule.register({
      secret: JWT_CONFIG.ACCESS_KEY,
      signOptions: { expiresIn: JWT_CONFIG.ACCESS_TIME },
    }),
  ],
  controllers: [AccountController, AccountControllerV2],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}
