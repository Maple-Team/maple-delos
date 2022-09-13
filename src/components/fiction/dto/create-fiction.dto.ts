export class CreateFictionDto {
  readonly bookName: string;
  readonly chapterTitle: string;
  readonly chapterNo: number;
  readonly chapterContent: string;
  readonly readCount: number;
  readonly label: FictionLabel[];
  readonly words: number;
}

export class FictionLabel {
  readonly id: string;
  readonly name: string;
}
