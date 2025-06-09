import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { ID, PWD, CONFIRM_PWD, USE_PWD, NAME, NICK_NAME } = createUserDto;

    if (PWD !== CONFIRM_PWD) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    }

    const exists = await this.prisma.user.findUnique({ where: { ID } });
    if (exists) {
      throw new BadRequestException('이미 존재하는 사용자입니다.');
    }

    const user = await this.prisma.user.create({
      data: {
        ID,
        PWD,
        USE_PWD,
        NAME,
        NICK_NAME,
        CREATE_DATE: new Date().getTime(),
        UPDATE_DATE: new Date().getTime(),
      },
    });

    return this.removeSensitiveFields(user);
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users.map(this.removeSensitiveFields);
  }

  async findOne(idx: number) {
    const user = await this.prisma.user.findUnique({ where: { IDX: idx } });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    return this.removeSensitiveFields(user);
  }

  async update(idx: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { IDX: idx } });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    if (updateUserDto.PWD !== updateUserDto.CONFIRM_PWD) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    }

    user.NICK_NAME = updateUserDto.NICK_NAME;
    user.UPDATE_DATE = Date.now();

    const updatedUser = await this.prisma.user.update({
      where: { IDX: idx },
      data: {
        NICK_NAME: updateUserDto.NICK_NAME,
        UPDATE_DATE: new Date().getTime(),
      },
    });

    return this.removeSensitiveFields(updatedUser);
  }

  async remove(idx: number): Promise<{ message: string, statusCode: number }> {
    const user = await this.prisma.user.findUnique({ where: { IDX: idx } });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    await this.prisma.user.delete({ where: { IDX: idx } });
    return { message: '사용자가 삭제되었습니다.', statusCode: 200 };
  }
  
  private removeSensitiveFields(user: User): Omit<User, 'PWD' | 'USE_PWD'> {
    const { PWD, USE_PWD, ...safeUser } = user;
    return safeUser;
  }
}