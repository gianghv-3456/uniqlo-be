import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Account } from "./entity/account.entity";
import { DataSource, Repository } from "typeorm";
import { LoginDto } from "../auth/dto/login.dto";
import { AcocuntUpdateDto } from "./dto/account-update.dto";
import { RegisterDto } from "../auth/dto/register.dto";
import { UpdateWishlistDto } from "./dto/update-wishlists.dto";
import { Wishlist } from "./entity/wishlist.entity";
import { UpdateStatusDto } from "./dto/update-status.dto";

@Injectable()
export class AccountService {

    constructor(
        @InjectRepository(Account) private readonly accountRepository: Repository<Account>,
        @InjectRepository(Wishlist) private readonly wishlistRepository: Repository<Wishlist>,
        private readonly dataSource: DataSource
    ) { };

    async getAccounts() {
        return await this.accountRepository.find({ relations: ['orders'] });
    }

    async getAccountById(id: number) {
        return await this.accountRepository.findOne({ where: { id: id } });
    }

    async register(account: RegisterDto) {
        const { name, email, password, birthday } = account;

        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const result = await queryRunner.manager.query(`INSERT INTO accounts (name, email, password, birthday) 
            VALUES($1, $2, $3, $4) RETURNING *;`, [name, email, password, birthday]);
            await queryRunner.commitTransaction();
            return result;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            // console.log(err.message);
            return err;
        } finally {
            await queryRunner.release();
        }
    }

    async login(loginDto: LoginDto) {
        const { email, role } = loginDto;
        const result = await this.accountRepository.findOne({ where: { email, role }, relations: ['carts'] });
        console.log(result);
        return result;
    }

    async update(accountUpdate: AcocuntUpdateDto) {
        const { id, ...data } = accountUpdate;
        return await this.accountRepository
            .createQueryBuilder()
            .update(Account)
            .set(data)
            .where("id = :id", { id: id })
            .returning("*")
            .execute();
    }

    async changePassword(data: Account) {
        return await this.accountRepository.save(data);
    }

    async changeWishlist(data: UpdateWishlistDto) {
        const { accountId, productId } = data;
        const wishlistFind = await this.wishlistRepository.findOne({ where: { account: { id: accountId }, product: { id: productId } } });

        if (wishlistFind) {
            const result = await this.wishlistRepository.delete(wishlistFind);
            return result;
        } else {

            const { accountId, productId } = data;

            const queryRunner = this.dataSource.createQueryRunner();

            await queryRunner.connect();
            await queryRunner.startTransaction();

            try {
                const result = await queryRunner.manager.query(`INSERT INTO wishlists (account_id, product_id) 
                    VALUES($1, $2) RETURNING *;`, [accountId, productId]);
                await queryRunner.commitTransaction();
                return result;
            } catch (err) {
                await queryRunner.rollbackTransaction();
                // console.log(err.message);
                return err;
            } finally {
                await queryRunner.release();
            }
        }
    }

    async getWishlistByAccount(id: number) {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const result = await queryRunner.manager.query(`SELECT * FROM wishlists WHERE account_id=$1;`, [id]);
            await queryRunner.commitTransaction();
            return result;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            // console.log(err.message);
            return err;
        } finally {
            await queryRunner.release();
        }
    }

    async setPassword(id: number) {
        const accountFind = await this.accountRepository.findOne({ where: { id } });

        if (accountFind.passwordReset !== null) {
            accountFind.password = accountFind.passwordReset;
            accountFind.passwordReset = null;
        }

        return await this.accountRepository.update(id, accountFind);
    }

    async changeStatus(data: UpdateStatusDto) {
        const accountFind = await this.accountRepository.findOne({ where: { id: data.id } });

        accountFind.active = data.active;

        try {
            return await this.accountRepository.update(data.id, accountFind);
        } catch (error) {
            console.log(error);
            return error;
        }
    }
}