import { Controller, Get, Query, Req } from "@nestjs/common";
import { VnPayService } from "./vnpay.service";
import { ResponseBuilder2 } from "src/utils/response-builder-v2";
import { ResponseCodeEnum } from "src/common/constants/response-code.enum";

@Controller("vnpay")
export class VNPayController {
    constructor(private readonly vnpayService: VnPayService) {}

    @Get("create")
    createPayment(@Query("amount") amount: number, @Req() req) {
        var ipAddr =
            req.headers["x-forwarded-for"] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        const paymentUrl = this.vnpayService.createPaymentUrl(+amount, ipAddr);
        return new ResponseBuilder2()
            .withData(paymentUrl)
            .withCode(ResponseCodeEnum.SUCCESS)
            .build();
    }

    @Get("return")
    returnUrl(@Query() queryParams: any) {
        const isValid = this.vnpayService.verifyReturnUrl(queryParams);
        if (isValid) {
            return { message: "Payment successful!", data: queryParams };
        } else {
            return { message: "Invalid payment data!" };
        }
    }
}
