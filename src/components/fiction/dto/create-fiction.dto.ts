import { Label } from 'src/components/label/entities/label.entity';

export class CreateFictionDto {
  readonly bookName: string;
  readonly chapterName: string;
  readonly chapterNo: number;
  readonly chapterContent: string;
  readonly readCount?: number;
  readonly labels?: Label[];
  readonly words: number;
}
