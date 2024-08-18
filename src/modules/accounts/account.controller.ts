import { BadRequestException, Body, Controller, Get, HttpStatus, NotFoundException, Param, ParseIntPipe, Put, Req, UnauthorizedException } from "@nestjs/common";
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

@Controller('accounts')
export class AccountController {
    constructor(
        private readonly accountService: AccountService,
        private readonly jwtService: JwtService
    ) { };

    @Get()
    async getAccounts() {
        let result = await this.accountService.getAccounts();

        result = result.filter(account => account.role !== ROLE.ADMIN);

        return {
            statusCode: HttpStatus.OK,
            message: "Get account successfully",
            data: result
        }
    }

    @Put('change-password')
    async changePassword(@Body() body: UpdatePasswordDto, @Req() request: Request) {

        const authHeader = request.headers['authorization'];
        const token = authHeader.substring(7);

        if (!token) {
            throw new UnauthorizedException("Missing token");
        }

        const infoToken = await this.jwtService.verifyAsync(token, { secret: JWT_CONFIG.ACCESS_KEY });
        const { id } = infoToken;

        const accountFind = await this.accountService.getAccountById(id);

        if (!accountFind) {
            throw new NotFoundException("Not found account");
        }

        const checkOldPassword = bcrypt.compareSync(body.oldPassword, accountFind.password);
        if (!checkOldPassword) {
            throw new BadRequestException("Old password wrong");
        }

        const checkNewPassword = bcrypt.compareSync(body.newPassword, accountFind.password);
        if (checkNewPassword) {
            throw new BadRequestException("The new password matches the old password")
        }

        const newPasswordHash = bcrypt.hashSync(body.newPassword, bcrypt.genSaltSync());
        accountFind.password = newPasswordHash;
        const resultChange = await this.accountService.changePassword(accountFind);

        if (resultChange) {
            return {
                statusCode: HttpStatus.OK,
                message: "Change password successfully",
                data: resultChange
            }
        }
    }

    @Put('update')
    async update(@Req() request: Request, @Body() body: AcocuntUpdateDto) {

        const authHeader = request.headers['authorization'];
        const token = authHeader.substring(7);
        if (!token) {
            throw new UnauthorizedException("Missing token");
        }

        const infoToken = await this.jwtService.verifyAsync(token, { secret: JWT_CONFIG.ACCESS_KEY });
        const { id } = infoToken;

        const accountUpdate = { id, ...body };

        const result = await this.accountService.update(accountUpdate);
        const data = result.raw[0];
        const imagePath = data.image_path;
        data.imagePath = imagePath;
        delete data.image_path;
        delete data.password;

        return {
            statusCode: HttpStatus.OK,
            message: "Information updated successfully",
            data
        }
    }

    @Put('change-wishlists')
    async changeWishlist(@Body() body: UpdateWishlistDto) {

        const result = await this.accountService.changeWishlist(body);

        return {
            statusCode: HttpStatus.OK,
            message: "Change wishlist successfully",
            data: result
        }
    }

    @Get('get-wishlists-by-account/:id')
    async getWishlistByAccount(@Param('id', ParseIntPipe) id: number) {

        const result = await this.accountService.getWishlistByAccount(id);

        return {
            statusCode: HttpStatus.OK,
            message: "Get wishlist successfully",
            data: result
        }
    }

    @Put('change-status')
    async updateStatus(@Body() body: UpdateStatusDto) {

        const result = await this.accountService.changeStatus(body);

        console.log(result);


        return {
            statusCode: HttpStatus.OK,
            message: "Update status successfully",
            data: body
        }
    }
}