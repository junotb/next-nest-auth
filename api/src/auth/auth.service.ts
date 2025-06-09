import { BadRequestException, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  private getJwtSecret(): string {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) throw new BadRequestException('JWT 비밀 키가 설정되어 있지 않습니다.');
    return jwtSecret;
  }
  
  async login(id: string, pwd: string, res: Response): Promise<{ message: string, statusCode: number }> {
    const encodedPassword = Buffer.from(pwd).toString('base64');

    // 사용자 조회
    const user = await this.prisma.user.findUnique({ where: { ID: id } });
    if (!user || user.PWD !== encodedPassword) {
      throw new BadRequestException('이메일 또는 비밀번호가 잘못되었습니다.');
    }

    // JWT 토큰 생성
    const payload = { sub: user.IDX };
    const accessToken = jwt.sign(payload, this.getJwtSecret(), { expiresIn: "15m" });
    const refreshToken = jwt.sign(payload, this.getJwtSecret(), { expiresIn: "7d" });

    // 쿠키 설정
    res.cookie('ACCESS_TOKEN', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production', // 프로덕션 환경에서는 secure 설정
      maxAge: 1000 * 60 * 15, // 15분
    });
    res.cookie('REFRESH_TOKEN', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
    });

    return { message: '로그인 성공', statusCode: 200 };
  }

  async refreshToken(req: Request, res: Response): Promise<{ message: string, statusCode: number }> {
    const refreshToken = req.cookies.REFRESH_TOKEN;
    if (!refreshToken) throw new BadRequestException('리프레시 토큰이 없습니다.');

    try {
      const payload = jwt.verify(refreshToken, this.getJwtSecret()) as any;

      const newAccessToken = jwt.sign({ sub: payload.sub }, this.getJwtSecret(), { expiresIn: "15m" });

      res.cookie('ACCESS_TOKEN', newAccessToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 15, // 15분
      });

      return { message: '토큰 갱신 성공', statusCode: 200 };
    } catch (error) {
      console.error('[refreshToken error]', error);
      throw new BadRequestException('리프레시 토큰이 유효하지 않습니다.');
    }
  }
}
