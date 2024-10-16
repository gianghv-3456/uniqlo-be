import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    Query,
} from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { OrderService } from "./order.service";
import { CartService } from "../carts/cart.service";
import { VariationService } from "../variations/variation.service";
import { ChangeStatusDto } from "./dto/change-status.dto";
import { ResponseBuilder2 } from "src/utils/response-builder-v2";
import { ResponseCodeEnum } from "src/common/constants/response-code.enum";

@Controller("v2/orders")
export class OrderControllerV2 {
    constructor(
        private readonly orderService: OrderService,
        private readonly cartService: CartService,
        private readonly variationService: VariationService
    ) {}

    @Get()
    async getOrders() {
        const result = await this.orderService.getOrders();

        // return {
        //     statusCode: HttpStatus.OK,
        //     message: "",
        //     data: result
        // };
        return new ResponseBuilder2()
            .withCode(ResponseCodeEnum.SUCCESS)
            .withMessage("Get successful orders")
            .withData(result)
            .build();
    }

    @Get("/v2")
    async getOrdersV2(@Query() query) {
        const { limit, page } = query;
        const [result, total] = await this.orderService.getOrdersV2(
            limit,
            page
        );

        return new ResponseBuilder2()
            .withCode(ResponseCodeEnum.SUCCESS)
            .withMessage("Get successful orders")
            .withData({
                items: result,
                meta: {
                    total: total,
                    page: page,
                },
            })
            .build();
    }

    @Get(":id")
    async getOrderByAccountId(@Param("id", ParseIntPipe) id: number) {
        const result = await this.orderService.getOrderByAccount(id);

        // return {
        //     statusCode: HttpStatus.OK,
        //     message: "Get successful variation",
        //     data: result
        // };
        return new ResponseBuilder2()
            .withCode(ResponseCodeEnum.SUCCESS)
            .withMessage("Get successful orders")
            .withData(result)
            .build();
    }

    @Post("create")
    async create(@Body() body: CreateOrderDto) {
        const result = await this.orderService.createOrder(body);

        if (result?.severity === "ERROR") {
            // throw new BadRequestException(result.detail);
            return new ResponseBuilder2()
                .withCode(ResponseCodeEnum.BAD_REQUEST)
                .withMessage(result.detail)
                .build();
        }

        const cart = body.products;

        const orderDetail = [];
        for (let i = 0; i < cart.length; i++) {
            const variationResult = await this.variationService.getProductById(
                cart[i].variationId
            );
            // const variation = variationResult.product.name + " " + variationResult.color
            //     + variationResult.price + variationResult.image + ":" + `${variationResult.product.id}` + "_" + `${variationResult.id}`;
            const variation = JSON.stringify({
                name: variationResult.product.name,
                color: variationResult.color,
                price: (
                    (variationResult.price *
                        (100 - variationResult.product.discountPercentage)) /
                    100
                ).toFixed(2),
                image: variationResult.image,
                productId: variationResult.product.id,
                variationId: variationResult.id,
            });
            orderDetail.push({
                variation,
                quantity: cart[i].quantity,
                order: result[0],
            });
        }
        const resultOrderDetail =
            await this.orderService.createOrderDetail(orderDetail);

        if (resultOrderDetail.length > 0) {
            await this.cartService.deleteMany(cart.map((item) => item.id));

            return new ResponseBuilder2()
                .withCode(ResponseCodeEnum.SUCCESS)
                .withMessage("Create successful order")
                .withData(result)
                .build();
        }
    }

    @Post("status")
    async changeStatus(@Body() body: ChangeStatusDto) {
        if (body.status !== "accept") {
            const result = await this.orderService.changeStatus(body);

            // return {
            //     statusCode: HttpStatus.OK,
            //     message: "Update successful order",
            //     data: result
            // };
            return new ResponseBuilder2()
                .withCode(ResponseCodeEnum.SUCCESS)
                .withMessage("Update successful order")
                .withData(result)
                .build();
        }

        const rawOrderDetails =
            await this.orderService.getOrderDetailsByOrderId(body.id);

        const orderDetails = rawOrderDetails.map((detail) => {
            const variation = JSON.parse(detail.variation);
            return {
                variationId: variation.variationId,
                quantity: detail.quantity,
            };
        });

        const resultCheckList =
            await this.variationService.checkListQuantity(orderDetails);

        if (resultCheckList.length !== 0) {
            // throw new BadRequestException(resultCheckList);
            return new ResponseBuilder2()
                .withCode(ResponseCodeEnum.BAD_REQUEST)
                .withMessage("Errors")
                .withData(resultCheckList)
                .build();
        }

        const resultMinus =
            await this.variationService.minusQuantity(orderDetails);

        if (resultMinus) {
            const result = await this.orderService.changeStatus(body);
            // return {
            //     statusCode: HttpStatus.OK,
            //     message: "Update successful order",
            //     data: result
            // };
            return new ResponseBuilder2()
                .withCode(ResponseCodeEnum.SUCCESS)
                .withMessage("Update successful order")
                .withData(result)
                .build();
        } else {
            // throw new BadRequestException("Can't minus");
            return new ResponseBuilder2()
                .withCode(ResponseCodeEnum.BAD_REQUEST)
                .withMessage("Can't minus")
                .build();
        }
    }
}
