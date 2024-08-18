import { AccountModule } from './../accounts/account.module';
import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JWT_CONFIG } from 'src/common/constants/jwt.constant';

@Module({
    imports: [
        AccountModule,
        JwtModule.register({
            secret: JWT_CONFIG.ACCESS_KEY,
            signOptions: { expiresIn: JWT_CONFIG.ACCESS_TIME }
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule { }