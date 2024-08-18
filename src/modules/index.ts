import { AccountModule } from "./accounts/account.module";
import { AuthModule } from "./auth/auth.module";
import { BrandModule } from "./brands/brand.module";
import { CartModule } from "./carts/cart.module";
import { CategoryModule } from "./categories/category.module";
import { EvaluationModule } from "./evaluations/evaluation.module";
import { ImageModule } from "./images/image.module";
import { MailerModule } from "./mailer/mailer.module";
import { OrderModule } from "./orders/order.module";
import { ProductModule } from "./products/product.module";
import { VariationModule } from "./variations/variation.module";

export const Modules = [
    AccountModule, AuthModule, CategoryModule, BrandModule, ProductModule, ImageModule,
    VariationModule, CartModule, OrderModule, EvaluationModule, MailerModule
]