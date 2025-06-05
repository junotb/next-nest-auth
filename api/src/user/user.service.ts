import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  private users: User[] = []
  private idCounter = 1

  async create(createUserDto: CreateUserDto) {
    if (createUserDto.PWD !== createUserDto.CONFIRM_PWD) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    }

    const exists = this.users.find(user => user.ID === createUserDto.ID);
    if (exists) {
      throw new BadRequestException('이미 존재하는 사용자입니다.');
    }

    const user = new User();
    user.IDX = this.idCounter++;
    user.ID = createUserDto.ID;
    user.PWD = createUserDto.PWD;
    user.USE_PWD = createUserDto.USE_PWD;
    user.NAME = createUserDto.NAME;
    user.NICK_NAME = createUserDto.NICK_NAME;
    user.CREATE_DATE = Date.now();
    user.UPDATE_DATE = Date.now();

    this.users.push(user);
    return this.removeSensitiveFields(user);
  }

  async findAll() {
    return this.users.map((user) => this.removeSensitiveFields(user));
  }

  async findOne(id: string, pwd: string) {
    const user = this.users.find((user) => user.ID === id);
    if (!user || user.PWD !== pwd) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    return this.removeSensitiveFields(user);
  }

  async update(idx: number, updateUserDto: UpdateUserDto) {
    const user = this.users.find((user) => user.IDX === idx);
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    if (updateUserDto.PWD !== updateUserDto.CONFIRM_PWD) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    }

    user.NICK_NAME = updateUserDto.NICK_NAME;
    user.UPDATE_DATE = Date.now();

    return this.removeSensitiveFields(user);
  }

  async remove(idx: number) {
    const index = this.users.findIndex((user) => user.IDX === idx);
    if (index === -1) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    this.users.splice(index, 1);
    return { message: '사용자가 삭제되었습니다.' };
  }
  
  private removeSensitiveFields(user: User): Omit<User, 'PWD' | 'USE_PWD'> {
    const { PWD, USE_PWD, ...safeUser } = user;
    return safeUser;
  }
}