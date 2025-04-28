import { UserRepositoryInterface } from './interfaces/repository/user.repository.interface';
import { User, UserDocument } from './entity/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BadRequestException, HttpException, HttpStatus } from "@nestjs/common";
import { RegisterDto } from '../auth/DTOs/register.dto';

export class UserRepository implements UserRepositoryInterface {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async findUserByEmail(email: string): Promise<UserDocument> {
    try {
      return await this.userModel.findOne({ email: email }).exec();
    } catch (err: any) {
      throw new HttpException(
        'Failed to fetch users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createUser(registerData: RegisterDto): Promise<void> {
    try {
      const newUser = new this.userModel({
        ...registerData,
      });
      await newUser.save();
    } catch (err: any) {
      throw new HttpException(
        'Failed to create users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUser(
    user_id: Types.ObjectId,
    propertiesForUpdate: Record<string, string>,
  ): Promise<void> {
    try {
      await this.userModel
        .findByIdAndUpdate(user_id, propertiesForUpdate)
        .exec();
    } catch (err: any) {
      if (err.name === 'ValidationError') {
        throw new BadRequestException(`Validation Error: ${err.message}`);
      }

      throw new HttpException(
        `Failed to create pharmacy: ${err.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
