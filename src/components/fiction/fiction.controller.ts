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
  Inject,
} from '@nestjs/common';
import { FictionService } from './fiction.service';
import { CreateFictionDto } from './dto/create-fiction.dto';
import { UpdateFictionDto } from './dto/update-fiction.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { LabelService } from '../label/label.service';

@Controller('fiction')
export class FictionController {
  @Inject(LabelService)
  private readonly labelService: LabelService;

  constructor(private readonly fictionService: FictionService) {}

  @Post()
  create(
    @Body()
    data: Omit<CreateFictionDto, 'lables'> & {
      labels: (number | string)[];
    },
  ) {
    const isNumber = (input: string | number) => {
      Object.prototype.toString.call(input) === '[object Number]'
        ? true
        : false;
    };
    const labelEntities = data.labels
      .filter(isNumber)
      .map((id) => this.labelService.findOne(+id));
    // return this.fictionService.handle(data);
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
    @Body() body: { bookName: string; labels: (string | number)[] },
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const { bookName, labels } = body;
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

          // return this.fictionService.create({
          //   bookName,
          //   chapterContent,
          //   words,
          //   chapterNo,
          //   chapterName,
          //   labels: [],
          // });
        }),
      Promise.resolve(),
    );
    return files.length;
  }
}
