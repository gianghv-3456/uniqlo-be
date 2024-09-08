import {
    BadRequestException,
    Body,
    Controller,
    HttpStatus,
    NotFoundException,
    Post,
    Req,
    UnauthorizedException,
} from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import * as bcrypt from "bcrypt";
import { AccountService } from "../accounts/account.service";
import { JwtService } from "@nestjs/jwt";
import { DataToken } from "src/common/interfaces/data-token.interface";
import { JWT_CONFIG } from "src/common/constants/jwt.constant";
import { Request } from "express";
import { RegisterDto } from "./dto/register.dto";
import { ResponseBuilder } from "src/utils/response-builder";
import { ResponseCodeEnum } from "src/common/constants/response-code.enum";

@Controller("auth")
export class AuthController {
    constructor(
        private readonly accountService: AccountService,
        private readonly jwtService: JwtService
    ) {}

    @Post("login")
    async login(@Body() loginDto: LoginDto) {
        console.log(loginDto);

        const account = await this.accountService.login(loginDto);

        console.log(account);

        if (!account) {
            // throw new NotFoundException('Account not found');
            return new ResponseBuilder()
                .withCode(ResponseCodeEnum.NOT_FOUND)
                .withMessage("Account not found")
                .build();
        }

        if (!account.active) {
            // throw new UnauthorizedException("Account block");
            return new ResponseBuilder()
                .withCode(ResponseCodeEnum.UNAUTHORIZED)
                .withMessage("Account block")
                .build();
        }

        // ================================================================
        if (!account.passwordReset) {
            if (!bcrypt.compareSync(loginDto.password, account.password)) {
                // throw new UnauthorizedException('Incorrect password')
                return new ResponseBuilder()
                    .withCode(ResponseCodeEnum.UNAUTHORIZED)
                    .withMessage("Incorrect password")
                    .build();
            }
        } else {
            if (
                !bcrypt.compareSync(loginDto.password, account.password) &&
                !bcrypt.compareSync(loginDto.password, account.passwordReset)
            ) {
                // throw new UnauthorizedException('Incorrect password')
                return new ResponseBuilder()
                    .withCode(ResponseCodeEnum.UNAUTHORIZED)
                    .withMessage("Incorrect password")
                    .build();
            }
        }

        const resultSetPassword = await this.accountService.setPassword(
            account.id
        );
        if (resultSetPassword.affected !== 1) {
            // throw new BadRequestException("Error update password");
            return new ResponseBuilder()
                .withCode(ResponseCodeEnum.BAD_REQUEST)
                .withMessage("Error update password")
                .build();
        }
        // ================================================================

        const { id, role } = account;

        const [accessToken, refreshToken] = await this.generatesToken({
            id,
            role,
        });

        delete account.password;

        // return {
        //     statusCode: HttpStatus.OK,
        //     message: "Logged in successfully",
        //     data: { ...account, accessToken, refreshToken }
        // }
        return new ResponseBuilder()
            .withCode(ResponseCodeEnum.SUCCESS)
            .withMessage("Logged in successfully")
            .withData({ ...account, accessToken, refreshToken })
            .build();
    }

    @Post("refresh_token")
    async refreshToken(@Req() request: Request) {
        const authHeader = request.headers["authorization"];
        const token = authHeader.substring(7);
        if (!token) {
            // throw new UnauthorizedException("Missing token");
            return new ResponseBuilder()
                .withCode(ResponseCodeEnum.UNAUTHORIZED)
                .withMessage("Missing token")
                .build();
        }

        const infoToken = await this.jwtService.verifyAsync(token, {
            secret: JWT_CONFIG.REFRESH_KEY,
        });
        const { id, role } = infoToken;
        const [accessToken, refreshToken] = await this.generatesToken({
            id,
            role,
        });

        // return {
        //     statusCode: HttpStatus.OK,
        //     message: "Refresh token successfully",
        //     data: { accessToken, refreshToken }
        // }
        return new ResponseBuilder()
            .withCode(ResponseCodeEnum.SUCCESS)
            .withMessage("Refresh token successfully")
            .withData({ accessToken, refreshToken })
            .build();
    }

    @Post("register")
    async register(@Body() body: RegisterDto) {
        body.password = bcrypt.hashSync(body.password, bcrypt.genSaltSync());

        const result = await this.accountService.register(body);

        if (result?.severity === "ERROR") {
            // throw new BadRequestException(result.detail);
            return new ResponseBuilder()
                .withCode(ResponseCodeEnum.BAD_REQUEST)
                .withMessage(result.detail)
                .build();
        }

        // return {
        //     statusCode: HttpStatus.CREATED,
        //     message: "Register successfully",
        //     data: result
        // }
        return new ResponseBuilder()
            .withCode(ResponseCodeEnum.CREATED)
            .withMessage("Register successfully")
            .withData(result)
            .build();
    }

    private generatesToken = async (data: DataToken) => {
        const accessToken = await this.jwtService.signAsync(data);
        const refreshToken = await this.jwtService.signAsync(data, {
            expiresIn: JWT_CONFIG.REFRESH_TIME,
            secret: JWT_CONFIG.REFRESH_KEY,
        });
        return [accessToken, refreshToken];
    };
}
