import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookmarkDto } from './dto/bookmark.dto';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  async create(bookmarkDto: BookmarkDto, user: User) {
    // create object in db
    const data = await this.prisma.bookMark.create({
      data: {
        title: bookmarkDto.title,
        url: bookmarkDto.url,
        description: bookmarkDto.description,
        userId: user.id,
      },
    });
    return data;
  }

  async findAll(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        bookMarks: true,
      },
    });
    return user.bookMarks;
  }

  async update(id: number, bookmarkDto: BookmarkDto) {
    const res = await this.prisma.bookMark.update({
      where: {
        id,
      },
      data: {
        title: bookmarkDto?.title || '',
        url: bookmarkDto?.url || '',
        description: bookmarkDto?.description || '',
      },
    });
    return res;
  }

  async remove(id: number) {
    await this.prisma.bookMark.delete({
      where: {
        id,
      },
    });
    return { message: 'Bookmark deleted' };
  }
}
