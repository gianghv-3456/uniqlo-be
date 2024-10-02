import {
  getMessage,
  ResponseCodeEnum,
} from "src/common/constants/response-code.enum"
import { ResponsePayload } from "./response-payload"
import { Console } from "console"

export class ResponseBuilder2<T> {
  private payload: ResponsePayload<T | null> = {
    data: {} as T | null,
    statusCode: ResponseCodeEnum.SUCCESS,
    message: "",
  }

  constructor(data?: T) {
    if (data) {
      this.payload.data = data
    }
  }

  withCode(code: ResponseCodeEnum, withMessage = true): ResponseBuilder2<T> {
    this.payload.statusCode = code
    if (withMessage) {
      this.payload.message = getMessage(code)
    }
    return this
  }

  withMessage(message: string): ResponseBuilder2<T> {
    this.payload.message = message
    return this
  }

  withData(data: T): ResponseBuilder2<T> {
    this.payload.data = data
    return this
  }

  build(): ResponsePayload<T | null> {
    // Ensure data is null if it is undefined or empty object. this will keep empty array as it is
    if (
      this.payload.data === undefined ||
      this.payload.data === null ||
      (typeof this.payload.data === "object" &&
        !Array.isArray(this.payload.data) &&
        Object.keys(this.payload.data).length === 0)
    ) {
      console.log("data is null")
      this.payload.data = null
    }
    console.log(this.payload)
    return this.payload
  }
}
