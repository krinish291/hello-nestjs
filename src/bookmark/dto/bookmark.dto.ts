import { IsNotEmpty, IsString } from 'class-validator';

export class BookmarkDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  url: string;

  @IsString()
  description: string;
}
