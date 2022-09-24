import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FictionService } from './fiction.service';
import { CreateFictionDto } from './dto/create-fiction.dto';
import { UpdateFictionDto } from './dto/update-fiction.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('fiction')
export class FictionController {
  constructor(private readonly fictionService: FictionService) {}

  @Post()
  create(@Body() createFictionDto: CreateFictionDto) {
    return this.fictionService.create(createFictionDto);
  }

  @Get()
  findAll() {
    return this.fictionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fictionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFictionDto: UpdateFictionDto) {
    return this.fictionService.update(+id, updateFictionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fictionService.remove(+id);
  }

  @Post('upload')
  @UseInterceptors(FilesInterceptor('fictions'))
  uploadFile(
    @Body() body: Pick<CreateFictionDto, 'bookName'>,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    // TODO do it async to work queue
    const { bookName } = body;
    files.reduce(
      (p, f) =>
        p.then(() => {
          const filename = decodeURIComponent(f.originalname);
          const chapterName = filename.replace(
            /第(\d+)章\s+(.*).html/,
            (_, p1, p2) => p2,
          );
          const chapterNo = +filename.replace(/第(\d+)章(.*)/, (_, p1) => p1);
          const chapterContent = f.buffer.toString();
          const words = chapterContent.length;

          return this.fictionService.create({
            bookName,
            chapterContent,
            words,
            chapterNo,
            chapterName,
          });
        }),
      Promise.resolve(),
    );

    // TODO unique response
    return files.length;
  }
}
