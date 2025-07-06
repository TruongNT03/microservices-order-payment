import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existUsername = await this.userRepo.findOne({
      where: {
        username: createUserDto.username,
      },
    });
    if (existUsername) {
      throw new BadRequestException(
        'Username đã được sử dụng vui lòng chọn username khác',
      );
    }

    const existEmail = await this.userRepo.findOne({
      where: {
        email: createUserDto.email,
      },
    });
    if (existEmail) {
      throw new BadRequestException(
        'Email đã được sử dụng vui lòng chọn email khác',
      );
    }

    const hashPassword = bcrypt.hashSync(createUserDto.password, 10);
    const user = this.userRepo.create({
      email: createUserDto.email,
      username: createUserDto.username,
      password: hashPassword,
    });
    await this.userRepo.save(user);
    const { password, ...resultInfo } = user;
    return {
      ...resultInfo,
    };
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(username: string) {
    const user = await this.userRepo.findOne({
      where: {
        username,
      },
    });
    if (!user) {
      throw new NotFoundException('Không tồn tại tài khoản!');
    }
    return user;
  }

  update(id: number, updateUserDto: any) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
