import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) throw new Error('JWT 비밀 키가 설정되어 있지 않습니다.');

    // JWT 전략 설정
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Authorization 헤더에서 Bearer 토큰 추출
      ignoreExpiration: false, // 만료된 토큰은 거부
      secretOrKey: jwtSecret, // JWT 비밀 키
    });
  }

  async validate(payload: any): Promise<{ idx: number; id: string; name: string; nickName: string; lastLoginDate: number | null }> {
    console.log('JWT payload:', payload);
    const user = await this.prisma.user.findUnique({ where: { IDX: payload.sub } });
    if (!user) throw new UnauthorizedException();
    return { idx: user.IDX, id: user.ID, name: user.NAME, nickName: user.NICK_NAME, lastLoginDate: user.LAST_LOGIN_DATE };
  }
}
