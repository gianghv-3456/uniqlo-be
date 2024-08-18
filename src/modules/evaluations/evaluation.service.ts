import { Injectable } from "@nestjs/common";
import { CreateEvaluationDto } from "./dto/CreateEvaluation.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Rating } from "./entity/rate.entity";
import { DataSource, Repository } from "typeorm";
import { Product } from "../products/entity/product.entity";
import { Review } from "./entity/reviews.entity";
import { Account } from "../accounts/entity/account.entity";

@Injectable()
export class EvaluationService {

    constructor(
        @InjectRepository(Rating) private readonly ratingRepository: Repository<Rating>,
        @InjectRepository(Review) private readonly reviewRepository: Repository<Review>,
        @InjectRepository(Product) private readonly prodcutRepository: Repository<Product>,
        private readonly dataSource: DataSource
    ) { };

    async createRating(data: CreateEvaluationDto) {
        const { star, productId, accountId } = data;

        const starFind = await this.ratingRepository.findOne({ where: { product: { id: productId }, account: { id: accountId } } });

        if (!starFind) {
            const queryRunner = this.dataSource.createQueryRunner();

            await queryRunner.connect();
            await queryRunner.startTransaction();

            try {
                const result = await queryRunner.manager.query(`INSERT INTO ratings (star, product_id, account_id) 
                    VALUES($1, $2, $3) RETURNING *;`, [star, productId, accountId]);
                await queryRunner.commitTransaction();

                const productFind = await this.prodcutRepository.findOne({
                    where: { id: productId },
                    select: ['id', 'name', 'averageRating', 'numberRating']
                });

                if (productFind.numberRating === 0 && productFind.averageRating == 0) {
                    productFind.averageRating = star;
                } else {
                    productFind.averageRating = parseFloat(
                        ((productFind.averageRating * productFind.numberRating + star) / (productFind.numberRating + 1)).toFixed(2)
                    );
                }
                productFind.numberRating += 1;
                await this.prodcutRepository.update(productId, productFind);
                return result;
            } catch (err) {
                await queryRunner.rollbackTransaction();
                console.log(err.message);
                return err;
            } finally {
                await queryRunner.release();
            }
        } else {
            starFind.star = star;
            const result = await this.ratingRepository.update(starFind.id, starFind);

            const productFind = await this.prodcutRepository.findOne({
                where: { id: productId },
                relations: ['ratings'],
                select: ['id', 'name', 'averageRating', 'numberRating', 'ratings']
            });
            const totalRating = productFind.ratings.reduce((total, item) => {
                return total += item.star;
            }, 0)
            productFind.averageRating = parseFloat((totalRating / productFind.numberRating).toFixed(2));

            const queryRunner = this.dataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();
            try {
                const resultUpdate = await queryRunner.manager.query(`UPDATE products SET average_rating=$1 WHERE id=$2;`,
                    [productFind.averageRating, productId]);
                await queryRunner.commitTransaction();
                return result;
            } catch (err) {
                await queryRunner.rollbackTransaction();
                console.log(err.message);
                return err;
            } finally {
                await queryRunner.release();
            }
        }
    }

    async createReview(data: CreateEvaluationDto) {
        const { content, productId, accountId } = data;
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const result = await queryRunner.manager.query(`INSERT INTO reviews (content, product_id, account_id) 
                VALUES($1, $2, $3) RETURNING *;`, [content, productId, accountId]);
            await queryRunner.commitTransaction();
            return result;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            console.log(err.message);
            return err;
        } finally {
            await queryRunner.release();
        }
    }

    async getRatingByAccount(id: number) {
        return await this.ratingRepository.find({ where: { account: { id } }, relations: ['product'] });
    }

    async getProductReviews(id: number) {
        const rawResult = await this.reviewRepository.find({ where: { product: { id } }, relations: ['account'], order: { createdAt: "DESC" } });
        const result = rawResult.map((review) => {
            const { name, imagePath } = review.account;

            return {
                ...review,
                account: { name, imagePath }
            }
        })
        return result;

    }

    async getProductStar(id: number) {
        const result = await this.ratingRepository.find({ where: { product: { id } }, relations: ['account'] });
        return result;
    }
}