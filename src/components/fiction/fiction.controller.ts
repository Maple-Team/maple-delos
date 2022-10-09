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
  async create(
    @Body()
    data: Omit<CreateFictionDto, 'lables'> & {
      labels: (number | string)[];
    },
  ) {
    // const isNumber = (input: string | number) => {
    //   return Object.prototype.toString.call(input) === '[object Number]'
    //     ? true
    //     : false;
    // };
    // const labels: (number | string)[] = data.labels;
    // const ids: number[] = labels.filter(isNumber) as number[];
    // const strs: string[] = labels.filter((s) => !isNumber(s)) as string[];

    // const { identifiers } = await this.labelService.batchCreate(
    //   strs.map((str) => {
    //     return {
    //       name: str,
    //       type: 'fiction',
    //     };
    //   }),
    // );
    // const insertIds = identifiers.map(({ id }) => id);

    // const labelEntities = [...ids, ...insertIds].map(
    //   async (id) => await this.labelService.findOne(+id),
    // );
    const { chapterContent, ...rest } = data;
    this.fictionService.create({
      ...rest,
      chapterContent: chapterContent.replaceAll(
        /<a.*>(.*)<\/a>/g,
        (_, p1) => p1,
      ),
      labels: [],
    });
  }

  @Get()
  findAll() {
    return this.fictionService.findAll();
  }
  @Get('list')
  async list() {
    const list = await this.fictionService.list();
    return `<ul style="display: flex; flex-wrap: wrap;">${list
      .map(
        (_) =>
          `<li style="width: calc(100% / 3);"><a href='${_.id}'>第${_.chapterNo}章 ${_.chapterName}</a></li>`,
      )
      .join('\r\n')}</ul>`;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return (await this.fictionService.findOne(+id))?.chapterContent;
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
    const { bookName } = body;
    files.reduce(
      (p, f) =>
        p.then(() => {
          const filename = decodeURIComponent(f.originalname);
          const chapterName = filename.replace(
            /.*第(\d+)章\s+(.*).html/,
            (_, p1, p2) => p2,
          );
          const chapterNo = +filename.replace(/.*第(\d+)章(.*)/, (_, p1) => p1);
          const chapterContent = f.buffer.toString();
          const _content = chapterContent.replaceAll(
            /<a.*>(.*)<\/a>/g,
            (_, p1) => p1,
          );
          const words = _content.length;

          return this.fictionService.create({
            bookName,
            chapterContent: _content,
            words,
            chapterNo,
            chapterName,
            labels: [],
          });
        }),
      Promise.resolve(),
    );
    return files.length;
  }
}
