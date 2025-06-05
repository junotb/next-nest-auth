import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    if (createUserDto.PWD !== createUserDto.CONFIRM_PWD) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    }

    const user = new User();
    user.ID = createUserDto.ID;
    user.PWD = createUserDto.PWD;
    user.USE_PWD = createUserDto.USE_PWD;
    user.NAME = createUserDto.NAME;
    user.NICK_NAME = createUserDto.NICK_NAME;

    const savedUser = await this.userRepository.save(user);
    const { PWD: removedPwd, USE_PWD: removedUsePwd, ...userWithoutPwd } = savedUser;
    return userWithoutPwd;
  }

  async findAll() {
    const users = await this.userRepository.find();
    const usersWithoutPwd = users.map((user) => {
      const { PWD: removedPwd, USE_PWD: removedUsePwd, ...userWithoutPwd } = user;
      return userWithoutPwd;
    });
    return usersWithoutPwd;
  }

  async findOne(id: string, pwd: string) {
    const user = await this.userRepository.findOne({ where: { ID: id, PWD: pwd } });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const { PWD: removedPwd, USE_PWD: removedUsePwd, ...userWithoutPwd } = user;
    return userWithoutPwd;
  }

  async update(idx: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { IDX: idx } });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    if (updateUserDto.PWD !== updateUserDto.CONFIRM_PWD) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    }

    user.NICK_NAME = updateUserDto.NICK_NAME;
    user.UPDATE_DATE = Date.now();

    const savedUser = await this.userRepository.save(user);
    const { PWD: removedPwd, USE_PWD: removedUsePwd, ...userWithoutPwd } = savedUser;
    return userWithoutPwd;
  }

  async remove(idx: number) {
    const user = await this.userRepository.findOne({ where: { IDX: idx } });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    await this.userRepository.delete(idx);
    return { message: '사용자가 삭제되었습니다.' };
  }
}
