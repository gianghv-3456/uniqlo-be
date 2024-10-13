import { Module } from "@nestjs/common"
import { VnpayModule as VnpayModuleLib } from "nestjs-vnpay"
import { ignoreLogger } from "vnpay"
import { VNPayController } from "./vnpay.controller"
import { VnPayService } from "./vnpay.service"

@Module({
  imports: [],
  controllers: [VNPayController],
  providers: [VnPayService],
})
export class VnpayModule {}
