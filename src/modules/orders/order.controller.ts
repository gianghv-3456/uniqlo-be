import { BadRequestException, Body, Controller, Get, HttpStatus, Param, ParseIntPipe, Post } from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { OrderService } from "./order.service";
import { CartService } from "../carts/cart.service";
import { VariationService } from "../variations/variation.service";
import { ChangeStatusDto } from "./dto/change-status.dto";

@Controller('orders')
export class OrderController {

    constructor(
        private readonly orderService: OrderService,
        private readonly cartService: CartService,
        private readonly variationService: VariationService
    ) { };

    @Get()
    async getOrders() {
        const result = await this.orderService.getOrders();

        return {
            statusCode: HttpStatus.OK,
            message: "Get successful variation",
            data: result
        };

    }

    @Get(':id')
    async getOrderByAccountId(@Param('id', ParseIntPipe) id: number) {

        const result = await this.orderService.getOrderByAccount(id);

        return {
            statusCode: HttpStatus.OK,
            message: "Get successful variation",
            data: result
        };
    }

    @Post('create')
    async create(@Body() body: CreateOrderDto) {

        const result = await this.orderService.createOrder(body);

        if (result?.severity === "ERROR") {
            throw new BadRequestException(result.detail);
        }

        const cart = await this.cartService.getCartById(body.account_id);

        const orderDetail = []
        for (let i = 0; i < cart.length; i++) {
            const variationResult = await this.variationService.getProductById(cart[i].variationId);
            // const variation = variationResult.product.name + " " + variationResult.color
            //     + variationResult.price + variationResult.image + ":" + `${variationResult.product.id}` + "_" + `${variationResult.id}`;
            const variation = JSON.stringify({
                name: variationResult.product.name,
                color: variationResult.color,
                price: (variationResult.price * (100 - variationResult.product.discountPercentage) / 100).toFixed(2),
                image: variationResult.image,
                productId: variationResult.product.id,
                variationId: variationResult.id,
            })
            orderDetail.push({ variation, quantity: cart[i].quantity, order: result[0] });
        }
        const resultOrderDetail = await this.orderService.createOrderDetail(orderDetail);

        if (resultOrderDetail.length > 0) {

            const resultDeleteCart = await this.cartService.deleteCartByAccountId(body.account_id);

            if (resultDeleteCart.affected > 0) {
                return {
                    statusCode: HttpStatus.OK,
                    message: "Create successful order",
                    data: result
                }
            }
        }
    }

    @Post('status')
    async changeStatus(@Body() body: ChangeStatusDto) {

        if (body.status !== 'accept') {
            const result = await this.orderService.changeStatus(body);

            return {
                statusCode: HttpStatus.OK,
                message: "Update successful order",
                data: result
            };
        }

        const rawOrderDetails = await this.orderService.getOrderDetailsByOrderId(body.id);

        const orderDetails = rawOrderDetails.map((detail) => {
            const variation = JSON.parse(detail.variation);
            return {
                variationId: variation.variationId,
                quantity: detail.quantity
            }
        })

        const resultCheckList = await this.variationService.checkListQuantity(orderDetails);

        if (resultCheckList.length !== 0) {
            throw new BadRequestException(resultCheckList);
        }

        const resultMinus = await this.variationService.minusQuantity(orderDetails);

        if (resultMinus) {
            const result = await this.orderService.changeStatus(body);
            return {
                statusCode: HttpStatus.OK,
                message: "Update successful order",
                data: result
            };
        } else {
            throw new BadRequestException("Can't minus");
        }

    }
}