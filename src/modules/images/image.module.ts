import { Module } from "@nestjs/common";
import { ImageController } from "./image.controller";
import { ImageService } from "./image.service";
import { Image } from "./entity/image.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { JWT_CONFIG } from "src/common/constants/jwt.constant";

@Module({
    imports: [
        TypeOrmModule.forFeature([Image]),
        JwtModule.register({
            secret: JWT_CONFIG.ACCESS_KEY,
            signOptions: { expiresIn: JWT_CONFIG.ACCESS_TIME }
        }),
    ],
    controllers: [ImageController],
    providers: [ImageService]
})
export class ImageModule { }