import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpStatus,
    NotFoundException,
    Param,
    ParseIntPipe,
    Put,
    Query,
    Req,
    UnauthorizedException,
} from "@nestjs/common";
import { AccountService } from "./account.service";
import { Request } from "express";
import { JwtService } from "@nestjs/jwt";
import { JWT_CONFIG } from "src/common/constants/jwt.constant";
import { AcocuntUpdateDto } from "./dto/account-update.dto";
import * as bcrypt from "bcrypt";
import { UpdatePasswordDto } from "./dto/update-password.dto";
import { UpdateWishlistDto } from "./dto/update-wishlists.dto";
import { ROLE } from "src/common/constants/role.enum";
import { UpdateStatusDto } from "./dto/update-status.dto";
import { ResponseBuilder2 } from "src/utils/response-builder-v2";
import { ResponseCodeEnum } from "src/common/constants/response-code.enum";

@Controller("v2/accounts")
export class AccountControllerV2 {
    constructor(
        private readonly accountService: AccountService,
        private readonly jwtService: JwtService
    ) {}

    @Get()
    async getAccounts() {
        let result = await this.accountService.getAccounts();

        result = result.filter((account) => account.role !== ROLE.ADMIN);

        // return {
        //     statusCode: HttpStatus.OK,
        //     message: "Get account successfully",
        //     data: result
        // }
        return new ResponseBuilder2()
            .withCode(ResponseCodeEnum.SUCCESS)
            .withData(result)
            .withMessage("Get account successfully")
            .build();
    }

    @Get("/:id")
    async getMyProfile(@Param("id", ParseIntPipe) id: number) {
        const result = await this.accountService.getAccountById(id);

        if (!result) {
            // throw new NotFoundException("Account not found");
            return new ResponseBuilder2()
                .withCode(ResponseCodeEnum.NOT_FOUND)
                .withMessage("Account not found")
                .build();
        }

        return new ResponseBuilder2()
            .withCode(ResponseCodeEnum.SUCCESS)
            .withData(result)
            .withMessage("Get account successfully")
            .build();
    }

    @Put("change-password")
    async changePassword(
        @Body() body: UpdatePasswordDto,
        @Req() request: Request
    ) {
        const authHeader = request.headers["authorization"];
        const token = authHeader.substring(7);

        if (!token) {
            return new ResponseBuilder2()
                .withCode(ResponseCodeEnum.UNAUTHORIZED)
                .withMessage("Missing token")
                .build();
        }

        const infoToken = await this.jwtService.verifyAsync(token, {
            secret: JWT_CONFIG.ACCESS_KEY,
        });
        const { id } = infoToken;

        const accountFind = await this.accountService.getAccountById(id);

        if (!accountFind) {
            // throw new NotFoundException("Not found account");
            return new ResponseBuilder2()
                .withCode(ResponseCodeEnum.NOT_FOUND)
                .withMessage("Not found account")
                .build();
        }

        const checkOldPassword = bcrypt.compareSync(
            body.oldPassword,
            accountFind.password
        );
        if (!checkOldPassword) {
            // throw new BadRequestException("Old password wrong");
            return new ResponseBuilder2()
                .withCode(ResponseCodeEnum.BAD_REQUEST)
                .withMessage("Old password wrong")
                .build();
        }

        const checkNewPassword = bcrypt.compareSync(
            body.newPassword,
            accountFind.password
        );
        if (checkNewPassword) {
            // throw new BadRequestException(
            //     "The new password matches the old password"
            // );
            return new ResponseBuilder2()
                .withCode(ResponseCodeEnum.BAD_REQUEST)
                .withMessage("The new password matches the old password")
                .build();
        }

        const newPasswordHash = bcrypt.hashSync(
            body.newPassword,
            bcrypt.genSaltSync()
        );
        accountFind.password = newPasswordHash;
        const resultChange =
            await this.accountService.changePassword(accountFind);

        if (resultChange) {
            // return {
            //     statusCode: HttpStatus.OK,
            //     message: "Change password successfully",
            //     data: resultChange,
            // };
            return new ResponseBuilder2()
                .withCode(ResponseCodeEnum.SUCCESS)
                .withMessage("Change password successfully")
                .withData(resultChange)
                .build();
        }
    }

    @Put("update")
    async update(@Req() request: Request, @Body() body: AcocuntUpdateDto) {
        const authHeader = request.headers["authorization"];
        const token = authHeader.substring(7);
        if (!token) {
            // throw new UnauthorizedException("Missing token");
            return new ResponseBuilder2()
                .withCode(ResponseCodeEnum.UNAUTHORIZED)
                .withMessage("Missing token")
                .build();
        }

        const infoToken = await this.jwtService.verifyAsync(token, {
            secret: JWT_CONFIG.ACCESS_KEY,
        });
        const { id } = infoToken;

        const accountUpdate = { id, ...body };

        const result = await this.accountService.update(accountUpdate);
        const data = result.raw[0];
        const imagePath = data.image_path;
        data.imagePath = imagePath;
        delete data.image_path;
        delete data.password;

        // return {
        //     statusCode: HttpStatus.OK,
        //     message: "Information updated successfully",
        //     data,
        // };
        return new ResponseBuilder2()
            .withCode(ResponseCodeEnum.SUCCESS)
            .withMessage("Information updated successfully")
            .withData(data)
            .build();
    }

    @Put("change-wishlists")
    async changeWishlist(@Body() body: UpdateWishlistDto) {
        const result = await this.accountService.changeWishlist(body);

        const responseBuilder = new ResponseBuilder2()
            .withCode(ResponseCodeEnum.SUCCESS)
            .withMessage("Change wishlist successfully");

        if (result) {
            responseBuilder.withData(result);
        }

        return responseBuilder.build();
    }

    @Get("get-wishlists-by-account/:id")
    async getWishlistByAccount(@Param("id", ParseIntPipe) id: number) {
        const result = await this.accountService.getWishlistByAccount(id);

        // return {
        //     statusCode: HttpStatus.OK,
        //     message: "Get wishlist successfully",
        //     data: result,
        // };
        return new ResponseBuilder2()
            .withCode(ResponseCodeEnum.SUCCESS)
            .withMessage("Get wishlist successfully")
            .withData(result)
            .build();
    }

    @Put("change-status")
    async updateStatus(@Body() body: UpdateStatusDto) {
        const result = await this.accountService.changeStatus(body);

        console.log(result);

        // return {
        //     statusCode: HttpStatus.OK,
        //     message: "Update status successfully",
        //     data: body,
        // };
        return new ResponseBuilder2()
            .withCode(ResponseCodeEnum.SUCCESS)
            .withMessage("Update status successfully")
            .withData(body)
            .build();
    }
}
