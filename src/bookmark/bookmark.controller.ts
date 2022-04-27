import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BookmarkService } from './bookmark.service';
import { BookmarkDto } from './dto/bookmark.dto';

@Controller('bookmark')
@UseGuards(AuthGuard('jwt'))
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Post()
  create(@Body() bookmarkDto: BookmarkDto, @Req() req: any) {
    return this.bookmarkService.create(bookmarkDto, req.user);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.bookmarkService.findAll(req.user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() bookmarkDto: BookmarkDto) {
    return this.bookmarkService.update(+id, bookmarkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookmarkService.remove(+id);
  }
}
