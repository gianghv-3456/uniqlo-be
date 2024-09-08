import { ResponseCodeEnum } from "src/common/constants/response-code.enum";

export interface ResponsePayload<T> {
    statusCode: ResponseCodeEnum;
    message?: string;
    data?: T;
}
