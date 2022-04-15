import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { AuthDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}
  async signIn(dto: AuthDto) {
    const { email, password } = dto;
    // find user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new ForbiddenException('Invalid email or password');
    }
    // check password
    const valid = await argon.verify(user.hash, password);
    if (!valid) {
      throw new ForbiddenException('Invalid email or password');
    }
    delete user.hash;
    const payload = {
      email,
      userId: user.id,
    };
    const signToken = await this.jwt.signAsync(payload, {
      expiresIn: '1d',
      secret: process.env.JWT_SECRET,
    });
    return {
      user,
      access_token: signToken,
    };
  }

  async signUp(dto: AuthDto) {
    const { email, password } = dto;
    try {
      const hash = await argon.hash(password);
      const user = await this.prisma.user.create({
        data: {
          email,
          hash,
        },
      });
      delete user.hash;
      return user;
    } catch (error) {
      console.log(error);
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already exists.');
        }
      }
      throw error;
    }
  }
}
