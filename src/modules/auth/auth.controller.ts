import { BadRequestException, Body, Controller, HttpStatus, NotFoundException, Post, Req, UnauthorizedException } from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import * as bcrypt from "bcrypt";
import { AccountService } from "../accounts/account.service";
import { JwtService } from "@nestjs/jwt";
import { DataToken } from "src/common/interfaces/data-token.interface";
import { JWT_CONFIG } from "src/common/constants/jwt.constant";
import { Request } from "express";
import { RegisterDto } from "./dto/register.dto";

@Controller('auth')
export class AuthController {

    constructor(
        private readonly accountService: AccountService,
        private readonly jwtService: JwtService
    ) { };

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        console.log(loginDto);

        const account = await this.accountService.login(loginDto);

        console.log(account);

        if (!account) {
            throw new NotFoundException('Account not found');
        }

        if (!account.active) {
            throw new UnauthorizedException("Account block");
        }

        // ================================================================
        if (!account.passwordReset) {
            if (!bcrypt.compareSync(loginDto.password, account.password)) {
                throw new UnauthorizedException('Incorrect password')
            }
        } else {
            if (!bcrypt.compareSync(loginDto.password, account.password) && !bcrypt.compareSync(loginDto.password, account.passwordReset)) {
                throw new UnauthorizedException('Incorrect password')
            }
        }

        const resultSetPassword = await this.accountService.setPassword(account.id);
        if (resultSetPassword.affected !== 1) {
            throw new BadRequestException("Error update password");
        }
        // ================================================================

        const { id, role } = account;

        const [accessToken, refreshToken] = await this.generatesToken({ id, role });

        delete account.password;

        return {
            statusCode: HttpStatus.OK,
            message: "Logged in successfully",
            data: { ...account, accessToken, refreshToken }
        }
    }

    @Post('refresh_token')
    async refreshToken(@Req() request: Request) {
        const authHeader = request.headers['authorization'];
        const token = authHeader.substring(7);
        if (!token) {
            throw new UnauthorizedException("Missing token");
        }

        const infoToken = await this.jwtService.verifyAsync(token, { secret: JWT_CONFIG.REFRESH_KEY });
        const { id, role } = infoToken;
        const [accessToken, refreshToken] = await this.generatesToken({ id, role });

        return {
            statusCode: HttpStatus.OK,
            message: "Refresh token successfully",
            data: { accessToken, refreshToken }
        }
    }

    @Post('register')
    async register(@Body() body: RegisterDto) {
        body.password = bcrypt.hashSync(body.password, bcrypt.genSaltSync());

        const result = await this.accountService.register(body);

        if (result?.severity === "ERROR") {
            throw new BadRequestException(result.detail);
        }

        return {
            statusCode: HttpStatus.CREATED,
            message: "Register successfully",
            data: result
        }
    }

    private generatesToken = async (data: DataToken) => {
        const accessToken = await this.jwtService.signAsync(data);
        const refreshToken = await this.jwtService.signAsync(data, { expiresIn: JWT_CONFIG.REFRESH_TIME, secret: JWT_CONFIG.REFRESH_KEY });
        return [accessToken, refreshToken];
    }
}