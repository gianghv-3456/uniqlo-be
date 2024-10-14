import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Account } from "./entity/account.entity"
import { Product } from "../products/entity/product.entity"
import { DataSource, Not, Repository } from "typeorm"
import { LoginDto } from "../auth/dto/login.dto"
import { AcocuntUpdateDto } from "./dto/account-update.dto"
import { RegisterDto } from "../auth/dto/register.dto"
import { UpdateWishlistDto } from "./dto/update-wishlists.dto"
import { Wishlist } from "./entity/wishlist.entity"
import { UpdateStatusDto } from "./dto/update-status.dto"
import { ROLE } from "src/common/constants/role.enum"

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly dataSource: DataSource
  ) {}

  async getAccounts() {
    return await this.accountRepository.find({ relations: ["orders"] })
  }

  async getAccountsV2(limit, page) {
    const skip = (page - 1) * limit
    // result = result.filter((account) => account.role !== ROLE.ADMIN);

    return await this.accountRepository.findAndCount({
      relations: ["orders"],
      skip: skip,
      take: limit,
      where: {
        role: Not(ROLE.ADMIN),
      },
    })
  }

  async getAccountById(id: number) {
    return await this.accountRepository.findOne({ where: { id: id } })
  }

  async register(account: RegisterDto) {
    const { name, email, password, birthday } = account

    const queryRunner = this.dataSource.createQueryRunner()

    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const result = await queryRunner.manager.query(
        `INSERT INTO accounts (name, email, password, birthday) 
            VALUES($1, $2, $3, $4) RETURNING *;`,
        [name, email, password, birthday]
      )
      await queryRunner.commitTransaction()
      return result
    } catch (err) {
      await queryRunner.rollbackTransaction()
      // console.log(err.message);
      return err
    } finally {
      await queryRunner.release()
    }
  }

  async login(loginDto: LoginDto) {
    const { email, role } = loginDto
    const result = await this.accountRepository.findOne({
      where: { email, role },
      relations: ["carts", "wishlists"],
    })
    console.log(result)
    return result
  }

  async update(accountUpdate: AcocuntUpdateDto) {
    const { id, ...data } = accountUpdate
    return await this.accountRepository
      .createQueryBuilder()
      .update(Account)
      .set(data)
      .where("id = :id", { id: id })
      .returning("*")
      .execute()
  }

  async changePassword(data: Account) {
    return await this.accountRepository.save(data)
  }

  async changeWishlist(data: UpdateWishlistDto) {
    const { accountId, productId } = data
    console.log(data)

    //validate userId and productId
    const accountFind = await this.accountRepository.findOne({
      where: { id: accountId },
    })

    if (!accountFind) {
      return null
    }

    const productFind = await this.productRepository.findOne({
      where: { id: productId },
    })

    if (!productFind) {
      return null
    }

    const wishlistFind = await this.wishlistRepository.findOne({
      where: { account: { id: accountId }, product: { id: productId } },
    })

    console.log(`wishlistFind`, wishlistFind)

    if (wishlistFind) {
      if (data.isFavorite) {
        return "done"
      }

      await this.wishlistRepository.delete(wishlistFind)
      return "done"
    } else {
      if (!data.isFavorite) {
        return "done"
      }

      const { accountId, productId } = data

      const queryRunner = this.dataSource.createQueryRunner()

      await queryRunner.connect()
      await queryRunner.startTransaction()

      try {
        const result = await queryRunner.manager.query(
          `INSERT INTO wishlists (account_id, product_id) 
                    VALUES($1, $2) RETURNING *;`,
          [accountId, productId]
        )
        await queryRunner.commitTransaction()
        return "done"
      } catch (err) {
        await queryRunner.rollbackTransaction()
        // console.log(err.message);
        return err
      } finally {
        await queryRunner.release()
      }
    }
  }

  async getWishlistByAccount(id: number) {
    const queryRunner = this.dataSource.createQueryRunner()

    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const result = await queryRunner.manager.query(
        `SELECT * FROM wishlists WHERE account_id=$1;`,
        [id]
      )
      await queryRunner.commitTransaction()
      return result
    } catch (err) {
      await queryRunner.rollbackTransaction()
      // console.log(err.message);
      return err
    } finally {
      await queryRunner.release()
    }
  }

  async setPassword(id: number) {
    const accountFind = await this.accountRepository.findOne({
      where: { id },
    })

    if (accountFind.passwordReset !== null) {
      accountFind.password = accountFind.passwordReset
      accountFind.passwordReset = null
    }

    return await this.accountRepository.update(id, accountFind)
  }

  async changeStatus(data: UpdateStatusDto) {
    const accountFind = await this.accountRepository.findOne({
      where: { id: data.id },
    })

    accountFind.active = data.active

    try {
      return await this.accountRepository.update(data.id, accountFind)
    } catch (error) {
      console.log(error)
      return error
    }
  }
}
