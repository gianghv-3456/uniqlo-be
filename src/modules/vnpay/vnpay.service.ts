import { Injectable } from "@nestjs/common";
import * as crypto from "crypto";
import * as moment from "moment";
import * as querystring from "qs";

@Injectable()
export class VnPayService {
    private vnp_TmnCode = "W5RX0ROL";
    private vnp_HashSecret = "5H1K68R1HECGMGFLMUU97876SP0JR3F0";
    private vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"; // URL sandbox
    private vnp_ReturnUrl = "http://localhost:3003/vnpay/return"; // URL nhận phản hồi sau khi thanh toán thành công

    createPaymentUrl(amount: number, ipAddr: string): string {
        function sortObject(obj) {
            let sorted = {};
            let str = [];
            let key;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    str.push(encodeURIComponent(key));
                }
            }
            str.sort();
            for (key = 0; key < str.length; key++) {
                sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(
                    /%20/g,
                    "+"
                );
            }
            return sorted;
        }

        let vnp_Params = {};
        vnp_Params["vnp_Version"] = "2.1.0";
        vnp_Params["vnp_Command"] = "pay";
        vnp_Params["vnp_TmnCode"] = this.vnp_TmnCode;
        vnp_Params["vnp_Amount"] = amount * 100;
        vnp_Params["vnp_BankCode"] = "NCB";
        vnp_Params["vnp_CreateDate"] = moment(new Date()).format(
            "YYYYMMDDHHmmss"
        );
        vnp_Params["vnp_CurrCode"] = "VND";
        vnp_Params["vnp_IpAddr"] = ipAddr;
        vnp_Params["vnp_Locale"] = "vn";
        vnp_Params["vnp_OrderInfo"] = "Thanh_toan_don_hang";
        vnp_Params["vnp_ReturnUrl"] =
            `${this.vnp_ReturnUrl}?&expire=${moment(new Date()).add(15, "minute").toDate().getTime()}`;
        vnp_Params["vnp_TxnRef"] = moment(new Date()).format("DDHHmmss");

        vnp_Params["vnp_OrderType"] = "other";

        vnp_Params = sortObject(vnp_Params);
        const signData = querystring.stringify(vnp_Params, {
            encode: false,
        });
        const hmac = crypto.createHmac("sha512", this.vnp_HashSecret);
        const signed = hmac.update(signData).digest("hex");
        vnp_Params["vnp_SecureHash"] = signed;
        const url = (this.vnp_Url +=
            "?" + querystring.stringify(vnp_Params, { encode: false }));

        return url;
    }

    verifyReturnUrl(queryParams: any): boolean {
        const secureHash = queryParams.vnp_SecureHash;
        delete queryParams.vnp_SecureHash;

        const sortedParams = Object.keys(queryParams)
            .sort()
            .reduce((acc, key) => {
                acc[key] = queryParams[key];
                return acc;
            }, {});

        const query = querystring.stringify(sortedParams, { encode: false });
        const hmac = crypto.createHmac("sha512", this.vnp_HashSecret);
        const signed = hmac.update(Buffer.from(query, "utf-8")).digest("hex");

        return secureHash === signed;
    }
}
