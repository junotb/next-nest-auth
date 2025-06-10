import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';
import { SafeUser } from 'src/common/type/safe-user.type';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 사용자 ID로 사용자 정보를 찾습니다.
   * @param id - 사용자 ID
   * @returns 사용자 정보
   * @throws NotFoundException - 사용자를 찾을 수 없는 경우
   */
  async findById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');
    return user;
  }

  /**
   * 사용자 ID로 안전한 사용자 정보를 찾습니다.
   * @param id - 사용자 ID
   * @returns 안전한 사용자 정보
   * @throws BadRequestException - 사용자가 이미 존재하는 경우
   */
  async create(createUserDto: CreateUserDto) {
    const { id, pwd, usePwd, name, nickname } = createUserDto;

    const exists = await this.prisma.user.findUnique({ where: { id } });
    if (exists) throw new BadRequestException('이미 존재하는 사용자입니다.');

    const user = await this.prisma.user.create({
      data: {
        id,
        pwd,
        usePwd,
        name,
        nickname,
        createDate: new Date().getTime(),
        updateDate: new Date().getTime(),
      },
    });

    return this.getSafeUser(user);
  }

  /**
   * 사용자 ID로 사용자 정보를 찾고 안전한 사용자 정보를 반환합니다.
   * @returns 안전한 사용자 정보들
   */
  async findAll() {
    const users = await this.prisma.user.findMany();
    return users.map(this.getSafeUser);
  }

  /**
   * 사용자 idx로 사용자 정보를 찾습니다.
   * @param idx - 사용자 idx
   * @returns 사용자 정보
   * @throws NotFoundException - 사용자를 찾을 수 없는 경우
   */
  async update(idx: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { idx } });
    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');

    user.nickname = updateUserDto.nickname;
    user.updateDate = Date.now();

    const updatedUser = await this.prisma.user.update({
      where: { idx },
      data: {
        nickname: updateUserDto.nickname,
        updateDate: new Date().getTime(),
      },
    });

    return this.getSafeUser(updatedUser);
  }

  /**
   * 사용자 idx로 사용자를 삭제합니다.
   * @param idx - 사용자 idx
   * @returns 삭제 메시지와 상태 코드
   * @throws NotFoundException - 사용자를 찾을 수 없는 경우
   */
  async remove(idx: number): Promise<{ message: string, statusCode: number }> {
    const user = await this.prisma.user.findUnique({ where: { idx } });
    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');

    await this.prisma.user.delete({ where: { idx } });
    return { message: '사용자가 삭제되었습니다.', statusCode: 200 };
  }

  /**
   * 사용자 정보를 안전하게 반환합니다.
   * @param user - 사용자 정보
   * @returns 안전한 사용자 정보
   */
  private getSafeUser(user: User): SafeUser {
    const { pwd, usePwd, ...safeUser } = user;
    return safeUser;
  }
}