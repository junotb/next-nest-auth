import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { SocialUser } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSocialUserDto } from './dto/create-social-user.dto';
import { DeleteSocialUserDto } from './dto/delete-social-user.dto';

@Injectable()
export class SocialUserService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 소셜 유저 정보를 찾습니다.
   * @param provider - 소셜 유저 provider
   * @param providerAccountId - 소셜 유저 provider 계정 ID
   * @returns 소셜 유저 정보
   */
  async findByProvider(provider: string, providerAccountId: string): Promise<SocialUser | null> {
    return await this.prisma.socialUser.findFirst({ where: { provider, providerAccountId } });
  }

  /**
   * 소셜 유저를 생성합니다.
   * @params CreateSocialUserDto - 소셜 유저 생성 DTO
   * @returns 소셜 유저 정보
   * @throws BadRequestException - 소셜 유저가 이미 존재하는 경우
   */
  async createSocialUser(dto: CreateSocialUserDto): Promise<SocialUser> {
    const { userIdx, provider, providerAccountId } = dto;

    const exists = await this.prisma.socialUser.findUnique({ where: { provider, providerAccountId } });
    if (exists) throw new BadRequestException('이미 존재하는 소셜 유저입니다.');

    const socialUser = await this.prisma.socialUser.create({
      data: {
        userIdx,
        provider,
        providerAccountId
      },
    });
    return socialUser;
  }

  /**
   * 소셜 유저를 삭제합니다.
   * @param DeleteSocialUserDto - 소셜 유저 삭제 DTO
   * @returns 삭제된 소셜 유저 정보
   * @throws NotFoundException - 소셜 유저를 찾을 수 없는 경우
   */
  async deleteSocialUser(dto: DeleteSocialUserDto): Promise<SocialUser> {
    const { userIdx } = dto;

    const socialUser = await this.prisma.socialUser.findUnique({ where: { userIdx } });
    if (!socialUser) throw new NotFoundException('소셜 유저를 찾을 수 없습니다.');

    const deletedSocialUser = await this.prisma.socialUser.delete({ where: { userIdx } });
    return deletedSocialUser;
  }
}