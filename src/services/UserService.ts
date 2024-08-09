import { Brackets, Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { LimitedUserData, UserData, UserQueryParams } from '../types';
import createHttpError from 'http-errors';
import userModel from '../models/userModel';

export class UserService {
  async create({ firstName, lastName, email, password, role }: UserData) {
    const user = await userModel.findOne({ email: email });

    if (user) {
      const err = createHttpError(400, 'Email is already exists!');
      throw err;
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    try {
      return await userModel.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
      });
    } catch (err) {
      const error = createHttpError(
        500,
        'Failed to store the data in the database',
      );
      throw error;
    }
  }

  async findByEmailWithPassword(email: string) {
    return await userModel.findOne({ email });
  }

  async findById(_id: string) {
    return await userModel.findById({ _id }, '-password');
  }

  async update(
    userId: number,
    { firstName, lastName, role, email, tenantId }: LimitedUserData,
  ) {
    try {
      // return await this.userRepository.update(userId, {
      //   firstName,
      //   lastName,
      //   role,
      //   email,
      // });
    } catch (err) {
      const error = createHttpError(
        500,
        'Failed to update the user in the database',
      );
      throw error;
    }
  }

  async getAll(validatedQuery: UserQueryParams) {
    // const queryBuilder = this.userRepository.createQueryBuilder('user');

    // if (validatedQuery.q) {
    //   const searchTerm = `%${validatedQuery.q}%`;
    //   queryBuilder.where(
    //     new Brackets((qb) => {
    //       qb.where("CONCAT(user.firstName, ' ', user.lastName) ILike :q", {
    //         q: searchTerm,
    //       }).orWhere('user.email ILike :q', { q: searchTerm });
    //     }),
    //   );
    // }

    // if (validatedQuery.role) {
    //   queryBuilder.andWhere('user.role = :role', {
    //     role: validatedQuery.role,
    //   });
    // }

    // const result = await queryBuilder
    //   // .leftJoinAndSelect("user.tenant", "tenant")
    //   .skip((validatedQuery.currentPage - 1) * validatedQuery.perPage)
    //   .take(validatedQuery.perPage)
    //   .orderBy('user.id', 'DESC')
    //   .getManyAndCount();
    const result = userModel.find({})
    console.log(result);
    
    return result;
  }

  async deleteById(userId: number) {
    // return await this.userRepository.delete(userId);
  }
}
