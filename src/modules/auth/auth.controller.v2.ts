import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  NotFoundException,
  Post,
  Req,
  UnauthorizedException,
} from "@nestjs/common"
import { LoginDto } from "./dto/login.dto"
import * as bcrypt from "bcrypt"
import { AccountService } from "../accounts/account.service"
import { JwtService } from "@nestjs/jwt"
import { DataToken } from "src/common/interfaces/data-token.interface"
import { JWT_CONFIG } from "src/common/constants/jwt.constant"
import { Request } from "express"
import { RegisterDto } from "./dto/register.dto"
import { ResponseBuilder2 } from "src/utils/response-builder-v2"
import { ResponseCodeEnum } from "src/common/constants/response-code.enum"

@Controller("v2/auth")
export class AuthControllerV2 {
  constructor(
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService
  ) {}

  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    console.log(loginDto)

    const account = await this.accountService.login(loginDto)

    console.log(account)

    if (!account) {
      // throw new NotFoundException('Account not found');
      return new ResponseBuilder2()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage("Account not found")
        .build()
    }

    if (!account.active) {
      // throw new UnauthorizedException("Account block");
      return new ResponseBuilder2()
        .withCode(ResponseCodeEnum.UNAUTHORIZED)
        .withMessage("Account block")
        .build()
    }

    // ================================================================
    if (!account.passwordReset) {
      if (!bcrypt.compareSync(loginDto.password, account.password)) {
        // throw new UnauthorizedException('Incorrect password')
        return new ResponseBuilder2()
          .withCode(ResponseCodeEnum.UNAUTHORIZED)
          .withMessage("Incorrect password")
          .build()
      }
    } else {
      if (
        !bcrypt.compareSync(loginDto.password, account.password) &&
        !bcrypt.compareSync(loginDto.password, account.passwordReset)
      ) {
        return new ResponseBuilder2()
          .withCode(ResponseCodeEnum.UNAUTHORIZED)
          .withMessage("Incorrect password")
          .build()
      }
    }

    const resultSetPassword = await this.accountService.setPassword(account.id)
    if (resultSetPassword.affected !== 1) {
      return new ResponseBuilder2()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage("Error update password")
        .build()
    }
    // ================================================================

    const wishlists = await this.accountService.getWishlistByAccount(account.id)

    let wishlistArray = []

    wishlists.forEach((wishlist) => {
      delete wishlist.account_id
      delete wishlist.id
      wishlistArray.push(wishlist.product_id)
    })

    const { id, role } = account

    const [accessToken, refreshToken] = await this.generatesToken({
      id,
      role,
    })

    delete account.password
    delete account.passwordReset
    account.wishlists = wishlistArray

    return new ResponseBuilder2()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage("Logged in successfully")
      .withData({ ...account, accessToken, refreshToken })
      .build()
  }

  @Post("refresh_token")
  async refreshToken(@Req() request: Request) {
    const authHeader = request.headers["authorization"]
    const token = authHeader.substring(7)
    if (!token) {
      // throw new UnauthorizedException("Missing token");
      return new ResponseBuilder2()
        .withCode(ResponseCodeEnum.UNAUTHORIZED)
        .withMessage("Missing token")
        .build()
    }

    const infoToken = await this.jwtService.verifyAsync(token, {
      secret: JWT_CONFIG.REFRESH_KEY,
    })
    const { id, role } = infoToken
    const [accessToken, refreshToken] = await this.generatesToken({
      id,
      role,
    })

    // return {
    //     statusCode: HttpStatus.OK,
    //     message: "Refresh token successfully",
    //     data: { accessToken, refreshToken }
    // }
    return new ResponseBuilder2()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage("Refresh token successfully")
      .withData({ accessToken, refreshToken })
      .build()
  }

  @Post("register")
  async register(@Body() body: RegisterDto) {
    body.password = bcrypt.hashSync(body.password, bcrypt.genSaltSync())

    const result = await this.accountService.register(body)

    if (result?.severity === "ERROR") {
      // throw new BadRequestException(result.detail);
      return new ResponseBuilder2()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(result.detail)
        .build()
    }

    // return {
    //     statusCode: HttpStatus.CREATED,
    //     message: "Register successfully",
    //     data: result
    // }
    return new ResponseBuilder2()
      .withCode(ResponseCodeEnum.CREATED)
      .withMessage("Register successfully")
      .withData(result)
      .build()
  }

  private generatesToken = async (data: DataToken) => {
    const accessToken = await this.jwtService.signAsync(data)
    const refreshToken = await this.jwtService.signAsync(data, {
      expiresIn: JWT_CONFIG.REFRESH_TIME,
      secret: JWT_CONFIG.REFRESH_KEY,
    })
    return [accessToken, refreshToken]
  }
}
