import { Injectable } from '@nestjs/common';

export type User = any;

@Injectable()
export class UserService {
  private static id = 3;
  private static users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
      email: 'john@gmail.com',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
      email: 'maria@gmail.com,',
    },
  ];
  create(createUserDto: CreateUserDto) {
    UserService.users.push({
      userId: UserService.id,
      username: createUserDto.username,
      password: createUserDto.password,
      email: createUserDto.email,
    });
    UserService.id += 1;
    const userInfo = UserService.users[UserService.users.length - 1];
    const { password, ...resultInfo } = userInfo;
    return {
      ...resultInfo,
    };
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(username: string): Promise<User | undefined> {
    return UserService.users.find((user) => user.username === username);
  }

  update(id: number, updateUserDto: any) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
